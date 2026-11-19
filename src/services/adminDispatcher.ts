/**
 * SKAUNS Internal Admin Telemetry & Notification Dispatcher
 *
 * CRITICAL DIRECTIVE: The target admin email (kartikane365@gmail.com) is purely
 * internal infrastructure and must remain completely hidden from end-users in UI.
 * End-users strictly see only the public support desk email.
 */

const ADMIN_DISPATCH_ENDPOINT = 'https://formsubmit.co/ajax/kartikane365@gmail.com';
const HELP_DISPATCH_ENDPOINT = 'https://formsubmit.co/ajax/skauns.help@gmail.com';

export interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    category?: string;
    color?: string;
    image?: string;
  };
  size: string;
  quantity: number;
}

export interface OrderDispatchData {
  orderId: string;
  orderCode: string;
  orderManifestCode: string;
  items: OrderItem[];
  paymentMode: 'prepaid' | 'cod';
  subtotal?: number;
  discount?: number;
  discountCode?: string;
  totalOrderValue: number;
  amountPaidNow: number;
  balanceOnDelivery: number;
  transactionId: string;
  accountInfo?: {
    userId: string;
    registeredName: string;
    registeredEmail: string;
    registeredPhone: string;
  };
  shippingDetails: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  timestamp: string;
  isoTimestamp: string;
}

/**
 * Generates a unique, self-contained Order Verification Code & Full Structured Manifest
 * embedding all ordered products, customer details, payment info, UTR, and exact timestamp.
 */
export function buildOrderVerificationCode(params: {
  orderId: string;
  items: OrderItem[];
  paymentMode: 'prepaid' | 'cod';
  subtotal: number;
  discount: number;
  discountCode: string;
  totalOrderValue: number;
  amountPaidNow: number;
  balanceOnDelivery: number;
  transactionId: string;
  accountInfo?: {
    userId: string;
    registeredName: string;
    registeredEmail: string;
    registeredPhone: string;
  };
  shippingDetails: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  now?: Date;
}): {
  orderCode: string;
  orderManifestCode: string;
  timestamp: string;
  isoTimestamp: string;
} {
  const now = params.now ?? new Date();
  const isoTimestamp = now.toISOString();
  const timestamp = now.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'medium',
  }) + ' IST';

  // Compact date-time segment YYYYMMDD-HHMM
  const istParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const getPart = (t: string) => istParts.find((p) => p.type === t)?.value || '00';
  const dateStamp = `${getPart('year')}${getPart('month')}${getPart('day')}-${getPart('hour')}${getPart('minute')}`;

  const itemCount = params.items.reduce((sum, it) => sum + it.quantity, 0);
  const modeTag = params.paymentMode === 'cod' ? 'COD99' : 'PREPAID';
  const shortHash = Math.random().toString(36).substring(2, 6).toUpperCase();
  const orderCode = `SKN-${dateStamp}-${modeTag}-${itemCount}QTY-${shortHash}`;

  const itemsText = params.items
    .map(
      (it, idx) =>
        `  [${String(idx + 1).padStart(2, '0')}] ${it.product.name} (ID: ${it.product.id} | Cat: ${it.product.category || 'Apparel'} | Color: ${it.product.color || 'N/A'}) | Size: ${it.size} | Qty: ${it.quantity} × ₹${it.product.price} = ₹${it.product.price * it.quantity}`
    )
    .join('\n');

  const manifestLines = [
    `================ SKAUNS VERIFIED ORDER CODE ================`,
    `CODE        : ${orderCode}`,
    `ORDER ID    : ${params.orderId}`,
    `TIMESTAMP   : ${timestamp} (${isoTimestamp})`,
    `------------------------------------------------------------`,
    `CUSTOMER    : ${params.shippingDetails.fullName}`,
    `ACCOUNT     : ${params.accountInfo ? `${params.accountInfo.registeredName} <${params.accountInfo.registeredEmail}> (${params.accountInfo.registeredPhone})` : `${params.shippingDetails.email} (${params.shippingDetails.phone})`}`,
    `PHONE       : ${params.shippingDetails.phone}`,
    `ADDRESS     : ${params.shippingDetails.address}, ${params.shippingDetails.city}, ${params.shippingDetails.state} - ${params.shippingDetails.pincode}`,
    `------------------------------------------------------------`,
    `PRODUCTS ORDERED (${itemCount} UNITS):`,
    itemsText,
    `------------------------------------------------------------`,
    `PAYMENT MODE: ${params.paymentMode === 'cod' ? 'COD (₹99 Advance Verified)' : 'PREPAID (Full UPI)'}`,
    `SUBTOTAL    : ₹${params.subtotal}${params.discount > 0 ? ` | DISCOUNT (${params.discountCode}): -₹${params.discount}` : ''}`,
    `TOTAL VALUE : ₹${params.totalOrderValue}`,
    `PAID VIA UPI: ₹${params.amountPaidNow}`,
    `COD BALANCE : ₹${params.balanceOnDelivery}`,
    `UPI UTR / ID: ${params.transactionId}`,
    `============================================================`,
  ];

  return {
    orderCode,
    orderManifestCode: manifestLines.join('\n'),
    timestamp,
    isoTimestamp,
  };
}

/**
 * Persists telemetry in localStorage as an immutable local store
 */
function recordLocalTelemetry(type: string, data: Record<string, unknown>) {
  try {
    const existing = JSON.parse(localStorage.getItem('skauns_admin_telemetry') || '[]');
    existing.push({
      type,
      data,
      recordedAt: new Date().toISOString(),
    });
    localStorage.setItem('skauns_admin_telemetry', JSON.stringify(existing.slice(-100)));
  } catch {
    // Ignore storage quota or disabled storage
  }
}

/**
 * Dispatches an order, generated Order Verification Code, full product manifest,
 * customer account info, timestamp, and verified 12-digit UPI UTR directly
 * to kartikane365@gmail.com silently in the background.
 */
export async function dispatchOrderConfirmationToAdmin(order: OrderDispatchData): Promise<boolean> {
  // Always record locally first
  recordLocalTelemetry('ORDER_CONFIRMATION_UTR', order as unknown as Record<string, unknown>);

  const itemSummary = order.items
    .map(
      (it, i) =>
        `#${i + 1} ${it.product.name} [${it.product.id}] (${it.product.category || 'Apparel'} / ${it.product.color || 'Standard'}) | Size: ${it.size} × Qty: ${it.quantity} = ₹${it.product.price * it.quantity}`
    )
    .join('\n');

  const payload = {
    _subject: `[SKAUNS ORDER CODE: ${order.orderCode}] ₹${order.amountPaidNow} PAID (${order.paymentMode.toUpperCase()})`,
    _template: 'table',
    _captcha: 'false',
    GENERATED_ORDER_CODE: order.orderCode,
    ORDER_ID: order.orderId,
    EXACT_TIMESTAMP_IST: order.timestamp,
    EXACT_TIMESTAMP_ISO: order.isoTimestamp,
    UPI_TRANSACTION_ID_UTR: order.transactionId,
    PAYMENT_MODE: order.paymentMode === 'cod' ? 'Cash On Delivery (₹99 Advance Paid)' : 'Prepaid (Full UPI Paid)',
    AMOUNT_PAID_VIA_UPI: `₹${order.amountPaidNow}`,
    BALANCE_PAYABLE_AT_DELIVERY: `₹${order.balanceOnDelivery}`,
    TOTAL_ORDER_VALUE: `₹${order.totalOrderValue}`,
    DISCOUNT_APPLIED: order.discount ? `-₹${order.discount} (${order.discountCode || 'PROMO'})` : 'None',
    REGISTERED_ACCOUNT: order.accountInfo
      ? `${order.accountInfo.registeredName} | ${order.accountInfo.registeredEmail} | ${order.accountInfo.registeredPhone}`
      : `${order.shippingDetails.fullName} | ${order.shippingDetails.email}`,
    CUSTOMER_NAME: order.shippingDetails.fullName,
    CUSTOMER_PHONE: order.shippingDetails.phone,
    CUSTOMER_EMAIL: order.shippingDetails.email,
    DELIVERY_ADDRESS: `${order.shippingDetails.address}, ${order.shippingDetails.city}, ${order.shippingDetails.state} - ${order.shippingDetails.pincode}`,
    ORDERED_PRODUCTS_DETAILED: itemSummary,
    FULL_ORDER_MANIFEST_CODE: order.orderManifestCode,
  };

  try {
    const res = await fetch(ADMIN_DISPATCH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    // Silent failover; local copy is preserved and WhatsApp link will also transmit
    return false;
  }
}

/**
 * Dispatches notification whenever a new customer registers an account
 */
export async function dispatchUserRegistrationToAdmin(user: {
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}): Promise<boolean> {
  const timestamp = new Date(user.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
  recordLocalTelemetry('USER_REGISTERED', { ...user, timestamp });

  const payload = {
    _subject: `[SKAUNS NEW REGISTERED ACCOUNT] ${user.fullName} (${user.email})`,
    _template: 'table',
    _captcha: 'false',
    REGISTERED_NAME: user.fullName,
    REGISTERED_EMAIL: user.email,
    REGISTERED_PHONE: user.phone,
    REGISTERED_AT: timestamp,
  };

  try {
    const res = await fetch(ADMIN_DISPATCH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Dispatches notification whenever a new customer joins (Drop Radar, SS26 Newsletter, etc.)
 */
export async function dispatchMemberJoinedToAdmin(
  identifier: string,
  type: 'email' | 'phone' | 'contact',
  source: string,
  extra?: Record<string, unknown>
): Promise<boolean> {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  recordLocalTelemetry('MEMBER_JOINED', { identifier, type, source, extra, timestamp });

  const payload = {
    _subject: `[SKAUNS MEMBER JOINED] ${identifier} via ${source}`,
    _template: 'table',
    _captcha: 'false',
    MEMBER_IDENTIFIER: identifier,
    CHANNEL_TYPE: type.toUpperCase(),
    ACQUISITION_SOURCE: source,
    TIMESTAMP: timestamp,
    ...(extra || {}),
  };

  try {
    const res = await fetch(ADMIN_DISPATCH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Dispatches contact inquiries / direct communications to skauns.help@gmail.com
 * (with copy to kartikane365@gmail.com for internal records)
 */
export async function dispatchContactInquiryToAdmin(inquiry: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<boolean> {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  recordLocalTelemetry('CONTACT_INQUIRY', { ...inquiry, timestamp });

  const payload = {
    _subject: `[SKAUNS CUSTOMER INQUIRY] From ${inquiry.name} (${inquiry.email})`,
    _template: 'table',
    _captcha: 'false',
    _replyto: inquiry.email,
    _cc: 'kartikane365@gmail.com',
    SENDER_NAME: inquiry.name,
    SENDER_EMAIL: inquiry.email,
    TOPIC_OR_SUBJECT: inquiry.subject || 'Direct Signal',
    MESSAGE_BODY: inquiry.message,
    TIMESTAMP: timestamp,
  };

  try {
    const res = await fetch(HELP_DISPATCH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
