export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shipping Policy</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Methods & Rates</h2>
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Free Shipping</h3>
                <p className="text-green-700">Orders over $75 qualify for free standard shipping (5-7 business days)</p>
              </div>
              <div className="space-y-4">
                <div className="border p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Standard Shipping - $5.99</h4>
                  <p className="text-gray-600">3-5 business days</p>
                </div>
                <div className="border p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Express Shipping - $12.99</h4>
                  <p className="text-gray-600">1-2 business days</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Live Plant Shipping</h2>
              <div className="bg-yellow-50 p-6 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Special Care for Living Plants</h3>
                <p className="text-yellow-700">Plants are shipped Monday-Wednesday to ensure safe weekend delivery and avoid weekend delays.</p>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Plants are carefully packaged with protective materials</li>
                <li>Temperature-controlled shipping during extreme weather</li>
                <li>Delivery may be delayed for plant safety during severe weather</li>
                <li>Someone must be available to receive plant shipments</li>
                <li>Plants arrive with detailed care instructions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Time</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Orders placed before 2 PM EST Monday-Friday ship the same day</li>
                <li>Orders placed after 2 PM or on weekends ship the next business day</li>
                <li>Live plants may require 1-2 days additional processing time</li>
                <li>Custom planters and large orders may take 3-5 business days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Locations</h2>
              <p className="text-gray-700 mb-4">We currently ship to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>All 50 United States</li>
                <li>Washington D.C.</li>
                <li>Puerto Rico (additional shipping charges apply)</li>
              </ul>
              <p className="text-gray-700 mt-4 italic">
                International shipping coming soon! Sign up for our newsletter to be notified.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Tracking</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Tracking information emailed once your order ships</li>
                <li>Track your order status in your account dashboard</li>
                <li>SMS notifications available upon request</li>
                <li>Customer service available for shipping questions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Issues</h2>
              <p className="text-gray-700 mb-4">If there are issues with your delivery:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Contact us within 48 hours of expected delivery</li>
                <li>Provide tracking number and order details</li>
                <li>We'll work with carriers to resolve delivery issues</li>
                <li>Replacement or refund provided for carrier damage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                Questions about shipping? Contact our customer service team at 
                shipping@okkyno.com or (800) 555-1234.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}