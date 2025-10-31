from typing import Any, Mapping

from sqlalchemy import Select, inspect
from sqlalchemy.orm.attributes import InstrumentedAttribute


def apply_filters(statement: Select, model: type, filters: Mapping[str, Any] | None) -> Select:
    if not filters:
        return statement

    for field, value in filters.items():
        if value in (None, "", []):
            continue
        attr = getattr(model, field, None)
        if isinstance(attr, InstrumentedAttribute):
            statement = statement.where(attr == value)

    return statement
