import { createLazyFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import postContact from "../api/postContact";

export const Route = createLazyFileRoute("/contact")({
  component: ContactRoute,
});

function ContactRoute() {
  const validateForm = (formData) => {
    const email = formData.get("email");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return false;
    }
    return true;
  };

  const mutation = useMutation({
    mutationFn: function (event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const formValidates = validateForm(formData);
      if (formValidates) {
        return postContact(
          formData.get("name"),
          formData.get("email"),
          formData.get("message"),
        );
      } else {
        throw new Error("Form validation failed.");
      }
    },
  });

  return (
    <div className="contact">
      <h2>Contact</h2>
      {mutation.isError ? (
        <p className="error-message">{mutation.error.message}</p>
      ) : mutation.isSuccess ? (
        <h3>Submitted!</h3>
      ) : (
        <form onSubmit={mutation.mutate}>
          <input name="name" placeholder="Name" />
          <input type="email" name="email" placeholder="Email" />
          <textarea placeholder="Message" name="message"></textarea>
          <button>Submit</button>
        </form>
      )}
    </div>
  );
}
