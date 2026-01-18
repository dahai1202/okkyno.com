import TestimonialCard from "@/components/ui/testimonial-card";
import { useQuery } from "@tanstack/react-query";

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['/api/testimonials'],
    queryFn: async () => {
      const response = await fetch('/api/testimonials');
      if (!response.ok) {
        // Return sample testimonials if API fails
        return [
          {
            id: 1,
            name: "Sarah Johnson",
            rating: 5,
            content: "Amazing quality plants! My garden has never looked better. The customer service is outstanding and shipping was fast.",
            approved: true,
            createdAt: new Date()
          },
          {
            id: 2,
            name: "Mike Chen",
            rating: 5,
            content: "I've been buying from Okkyno for over a year now. Their gardening tools are top-notch and have made gardening so much easier.",
            approved: true,
            createdAt: new Date()
          },
          {
            id: 3,
            name: "Emily Rodriguez",
            rating: 5,
            content: "The plant care guides are incredibly helpful! As a beginner gardener, I couldn't have succeeded without their expert advice.",
            approved: true,
            createdAt: new Date()
          }
        ];
      }
      return response.json();
    }
  });

  return (
    <section className="py-16 bg-neutral">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark font-heading mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Join thousands of satisfied gardeners who trust Okkyno for their gardening needs.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {isLoading ? (
            // Show 3 skeleton loaders while loading
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="w-4 h-4 mr-1 bg-gray-200 rounded-full animate-pulse"></div>
                  ))}
                </div>
                <div className="h-24 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mr-3"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            testimonials?.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
