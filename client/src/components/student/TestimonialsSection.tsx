import { Link } from "react-router-dom";
import { assets, dummyTestimonial } from "../../assets/assets";
import { Testimonial } from "../../types";

export default function TestimonialSection() {
  return (
    <div className="text-center">
      <h2>Testimonials</h2>
      <p className="text-sm md:text-base text-gray-500 mt-3 max-w-3xl mx-auto">
        Hear from our learners as they share their journeys of transformation, success,
        and how our platform has made a difference in their lives.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 container mx-auto">
        {dummyTestimonial.map((testimonial: Testimonial, i) => (
          <div
            key={i}
            className="text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px-0px] shadow-black/5 overflow-hidden"
          >
            <div className="flex items-center gap-4 px-5 py-4 bg-gray-500/10">
              <img
                className="h-12 w-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h1 className="text-lg font-medium text-gray-800">{testimonial.name}</h1>
                <p className="text-gray-800/80">{testimonial.role}</p>
              </div>
            </div>
            <div className="p-5 pb-7">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img
                    className="h-5"
                    key={i}
                    src={
                      i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank
                    }
                    alt="star"
                  />
                ))}
              </div>
              <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
            </div>
            <Link to="#" className="text-blue-500 underline px-5">
              Read more
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
