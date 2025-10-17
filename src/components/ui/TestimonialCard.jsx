// src/components/ui/TestimonialCard.js
import "./TestimonialCard.css";

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="testimonial-card">
      <p className="testimonial-quote">"{testimonial.quote}"</p>
      <div className="testimonial-author">
        <span className="testimonial-author-name">— {testimonial.author}</span>
      </div>
    </div>
  );
};

export default TestimonialCard;
