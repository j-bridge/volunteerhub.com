from math import ceil
from typing import Type

from flask import request
from marshmallow import Schema

from ..extensions import db


def paginate_query(query, schema_cls: Type[Schema], default_page: int = 1, default_per_page: int = 20, max_per_page: int = 100) -> dict:
    page = _coerce_positive_int(request.args.get("page", default_page), default_page)
    per_page = _coerce_positive_int(request.args.get("per_page", default_per_page), default_per_page)
    per_page = min(per_page, max_per_page)

    pagination = db.paginate(query, page=page, per_page=per_page, error_out=False)
    schema = schema_cls(many=True)

    return {
        "items": schema.dump(pagination.items),
        "meta": {
            "page": page,
            "per_page": per_page,
            "total_items": pagination.total,
            "total_pages": ceil(pagination.total / per_page) if per_page else 0,
        },
    }


def _coerce_positive_int(value, fallback: int) -> int:
    try:
        number = int(value)
    except (TypeError, ValueError):
        return fallback
    return number if number > 0 else fallback
