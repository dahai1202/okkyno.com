export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using Okkyno.com, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Products and Services</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>All plants are living organisms and may vary slightly from photos</li>
                <li>We guarantee plants arrive healthy and provide care instructions</li>
                <li>Product availability is subject to seasonal and supply limitations</li>
                <li>Prices are subject to change without notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders and Payment</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Orders are processed within 1-2 business days</li>
                <li>Payment is required at time of order placement</li>
                <li>We reserve the right to cancel orders for any reason</li>
                <li>Incorrect shipping information may result in additional charges</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping and Delivery</h2>
              <p className="text-gray-700 mb-4">
                Shipping times are estimates and may vary due to weather conditions, carrier delays, 
                or other factors beyond our control.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>We ship Monday through Wednesday to ensure weekend delivery</li>
                <li>Someone must be available to receive live plant shipments</li>
                <li>Delivery delays due to weather may occur for plant safety</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Returns and Refunds</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>14-day guarantee on all live plants</li>
                <li>Photos required for plant health claims</li>
                <li>Shipping costs are non-refundable except for our errors</li>
                <li>Refunds processed within 5-7 business days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>You are responsible for maintaining account security</li>
                <li>Provide accurate and current information</li>
                <li>One account per person or business entity</li>
                <li>We reserve the right to suspend accounts for policy violations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700">
                Okkyno.com shall not be liable for any indirect, incidental, special, or 
                consequential damages resulting from the use or inability to use our products or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700">
                For questions about these Terms of Service, contact us at legal@okkyno.com 
                or (800) 555-1234.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}