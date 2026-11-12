"""API v1 router assembly."""

from fastapi import APIRouter

from app.api.v1.audit import router as audit_router
from app.api.v1.cases import router as cases_router
from app.api.v1.edges import router as edges_router
from app.api.v1.graph import router as graph_router
from app.api.v1.nodes import router as nodes_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(cases_router)
api_router.include_router(graph_router)
api_router.include_router(nodes_router)
api_router.include_router(edges_router)
api_router.include_router(audit_router)
