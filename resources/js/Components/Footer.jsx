// In your Footer component
export default function Footer() {
  return (
    <footer className="footer mt-auto py-3">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 small text-muted">
              <a 
                href="https://www.pysync.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                Developed By Py.Sync PVT LTD
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}