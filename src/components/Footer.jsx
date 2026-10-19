function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
        <span className="fw-bold">🛍️ Sales Savvy</span>
        <small className="text-secondary">
          © {new Date().getFullYear()} Sales Savvy. Built with React, Spring Boot and MySQL.
        </small>
      </div>
    </footer>
  );
}

export default Footer;