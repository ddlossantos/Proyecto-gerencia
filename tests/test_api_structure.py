import os

os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from backend.app.main import app


def test_expected_routes_are_registered():
    routes = {(route.path, method) for route in app.routes for method in route.methods or []}

    assert ("/api/health", "GET") in routes
    assert ("/api/departments/{department_id}", "PUT") in routes
    assert ("/api/departments/{department_id}", "DELETE") in routes
    assert ("/api/employees/{codigo_empresa}/workspace", "GET") in routes
    assert ("/api/recruitment/analyze", "POST") in routes


def test_api_uses_current_lifespan_configuration():
    assert app.router.lifespan_context is not None
