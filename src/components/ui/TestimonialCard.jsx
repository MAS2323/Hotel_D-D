// src/components/ui/TestimonialCard.js
import "./TestimonialCard.css";

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="testimonial-card">
      <p className="testimonial-quote">"{testimonial.content}"</p>
      <div className="testimonial-author">
        <span className="testimonial-author-name">— {testimonial.author}</span>
        <span className="testimonial-date">
          {new Date(testimonial.created_at).toLocaleDateString("es-ES")}
        </span>
      </div>
    </div>
  );
};

export default TestimonialCard;
