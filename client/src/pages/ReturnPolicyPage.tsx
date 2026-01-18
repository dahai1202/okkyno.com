export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Return Policy</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="bg-green-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-bold text-green-800 mb-2">14-Day Plant Guarantee</h2>
              <p className="text-green-700">We guarantee all live plants for 14 days from delivery. If your plant doesn't survive with proper care, we'll replace it or provide a full refund.</p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Live Plant Returns</h2>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Covered:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Plants that arrive damaged or unhealthy</li>
                <li>Plants that decline within 14 days despite proper care</li>
                <li>Wrong plant species delivered</li>
                <li>Significantly smaller size than described</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Not Covered:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Natural leaf yellowing or minor cosmetic issues</li>
                <li>Damage due to improper care or extreme conditions</li>
                <li>Changes in plant appearance due to new environment</li>
                <li>Pest issues introduced after delivery</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Process</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Step 1: Contact Us</h4>
                  <p className="text-gray-700">Email returns@okkyno.com within 14 days of delivery with your order number and photos of the plant.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Step 2: Documentation</h4>
                  <p className="text-gray-700">Include clear photos showing the plant's condition and describe the care provided.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Step 3: Resolution</h4>
                  <p className="text-gray-700">We'll review your request within 1 business day and provide replacement or refund options.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Plant Items</h2>
              <p className="text-gray-700 mb-4">Planters, tools, and accessories can be returned within 30 days:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Items must be in original condition and packaging</li>
                <li>Customer pays return shipping unless item was defective</li>
                <li>Refund processed within 5-7 business days</li>
                <li>Custom or personalized items are final sale</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Information</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Refunds issued to original payment method</li>
                <li>Processing time: 5-7 business days</li>
                <li>Original shipping costs are non-refundable (except our errors)</li>
                <li>Plant care credits available for future purchases</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Plant Care Support</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Before Returning Your Plant</h3>
                <p className="text-blue-700 mb-3">Our plant experts are here to help! Contact us for troubleshooting advice:</p>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>Watering and lighting guidance</li>
                  <li>Pest identification and treatment</li>
                  <li>Seasonal care adjustments</li>
                  <li>Repotting assistance</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <div className="space-y-2">
                <p className="text-gray-700">Returns: returns@okkyno.com</p>
                <p className="text-gray-700">Plant Care Help: care@okkyno.com</p>
                <p className="text-gray-700">Phone: (800) 555-1234</p>
                <p className="text-gray-700">Hours: Monday-Friday, 9 AM - 5 PM EST</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}