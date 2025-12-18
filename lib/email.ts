import { Resend } from "resend";
import type { Order, OrderItem } from "@/models/Order";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailData {
  order: Order & { _id: string };
}

export async function sendOrderConfirmationEmail(emailData: OrderEmailData) {
  const { order } = emailData;

  const itemsHtml = order.items
    .map(
      (item: OrderItem) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px; text-align: left;">${item.name}</td>
      <td style="padding: 12px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; text-align: right;">$${item.price.toFixed(
        2
      )}</td>
      <td style="padding: 12px; text-align: right;">$${(
        item.price * item.quantity
      ).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 20px; }
          .order-section { margin: 20px 0; }
          .section-title { font-size: 16px; font-weight: bold; color: #667eea; margin-bottom: 10px; border-bottom: 2px solid #667eea; padding-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          .summary { background: white; padding: 15px; border-radius: 8px; margin-top: 15px; }
          .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .summary-row.total { font-size: 18px; font-weight: bold; color: #667eea; border-top: 2px solid #e5e7eb; padding-top: 10px; }
          .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .label { font-weight: bold; color: #374151; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation 🎉</h1>
            <p>Thank you for your purchase!</p>
          </div>
          
          <div class="content">
            <p>Hi ${order.customerInfo.name},</p>
            <p>Your order has been confirmed and is being prepared for shipment. Below is your order details:</p>
            
            <div class="order-section">
              <div class="section-title">Order Information</div>
              <div class="summary">
                <div class="summary-row">
                  <span class="label">Order Number:</span>
                  <span>#${order._id}</span>
                </div>
                <div class="summary-row">
                  <span class="label">Order Date:</span>
                  <span>${new Date(
                    order.createdAt || ""
                  ).toLocaleDateString()}</span>
                </div>
                <div class="summary-row">
                  <span class="label">Payment Status:</span>
                  <span style="color: #10b981; font-weight: bold;">✓ ${
                    order.paymentStatus || "completed"
                  }</span>
                </div>
              </div>
            </div>

            <div class="order-section">
              <div class="section-title">Products Ordered</div>
              <table>
                <thead>
                  <tr style="background: #f3f4f6;">
                    <th style="padding: 12px; text-align: left;">Product</th>
                    <th style="padding: 12px; text-align: center;">Qty</th>
                    <th style="padding: 12px; text-align: right;">Price</th>
                    <th style="padding: 12px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </div>

            <div class="order-section">
              <div class="section-title">Shipping Address</div>
              <div class="summary">
                <p style="margin: 0;">
                  ${order.customerInfo.address.street}<br>
                  ${order.customerInfo.address.city}, ${
    order.customerInfo.address.state
  } ${order.customerInfo.address.zipCode}<br>
                  ${order.customerInfo.address.country}
                </p>
              </div>
            </div>

            <div class="order-section">
              <div class="section-title">Order Summary</div>
              <div class="summary">
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>$${(order.totalPrice / 1.08).toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>Tax (8%):</span>
                  <span>$${(order.totalPrice - order.totalPrice / 1.08).toFixed(
                    2
                  )}</span>
                </div>
                <div class="summary-row total">
                  <span>Total Amount:</span>
                  <span>$${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <p style="margin-top: 20px;">We'll send you a tracking number once your order ships. Thank you for shopping with us!</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
          </div>

          <div class="footer">
            <p>© 2025 Purelife Store. All rights reserved.</p>
            <p>Questions? Reply to this email or visit our contact page.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: "orders@purelife.dev",
      to: order.customerInfo.email,
      subject: `Order Confirmation - Order #${order._id}`,
      html,
    });

    console.log("Order confirmation email sent:", response);
    return response;
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    throw error;
  }
}

export async function sendShippedNotificationEmail(emailData: OrderEmailData) {
  const { order } = emailData;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 20px; }
          .order-section { margin: 20px 0; }
          .section-title { font-size: 16px; font-weight: bold; color: #10b981; margin-bottom: 10px; border-bottom: 2px solid #10b981; padding-bottom: 8px; }
          .summary { background: white; padding: 15px; border-radius: 8px; margin-top: 15px; }
          .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
          .label { font-weight: bold; color: #374151; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Order is on the Way! 📦</h1>
          </div>
          
          <div class="content">
            <p>Hi ${order.customerInfo.name},</p>
            <p>Great news! Your order has been shipped and is on its way to you.</p>
            
            <div class="order-section">
              <div class="section-title">Shipment Details</div>
              <div class="summary">
                <div class="summary-row">
                  <span class="label">Order Number:</span>
                  <span>#${order._id}</span>
                </div>
                <div class="summary-row">
                  <span class="label">Status:</span>
                  <span style="color: #10b981; font-weight: bold;">✓ Shipped</span>
                </div>
                <div class="summary-row">
                  <span class="label">Shipped Date:</span>
                  <span>${new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div class="order-section">
              <div class="section-title">Shipping To</div>
              <div class="summary">
                <p style="margin: 0;">
                  ${order.customerInfo.address.street}<br>
                  ${order.customerInfo.address.city}, ${
    order.customerInfo.address.state
  } ${order.customerInfo.address.zipCode}<br>
                  ${order.customerInfo.address.country}
                </p>
              </div>
            </div>

            <p style="margin-top: 20px; padding: 15px; background: #dcfce7; border-left: 4px solid #10b981; border-radius: 4px;">
              <strong>Note:</strong> Tracking information will be updated shortly. Please check back for your tracking number.
            </p>

            <p style="margin-top: 20px;">Thank you for your patience, and we appreciate your business!</p>
          </div>

          <div class="footer">
            <p>© 2025 Purelife Store. All rights reserved.</p>
            <p>Questions? Reply to this email or visit our contact page.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: "orders@purelife.dev",
      to: order.customerInfo.email,
      subject: `Your Order #${order._id} Has Shipped! 📦`,
      html,
    });

    console.log("Shipped notification email sent:", response);
    return response;
  } catch (error) {
    console.error("Failed to send shipped notification email:", error);
    throw error;
  }
}
