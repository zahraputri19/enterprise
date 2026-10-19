# app/controllers/review_controller.py
# Lapisan controller: memvalidasi input, memanggil service, membentuk response JSON,
# dan menangkap error lewat try except. Tidak ada query atau aturan bisnis di sini.

import traceback
from flask import current_app, jsonify, request
from app.exceptions import (
    DuplicateReviewError,
    ProductNotFoundError,
    ProductServiceUnavailableError,
    ReviewNotFoundError,
    ValidationError,
)
from app.schemas.review_schema import validate_create_review, validate_update_review
from app.services import review_service


# GET /reviews/product/<product_id>
def list_by_product(product_id):
    try:
        data = review_service.get_product_reviews(product_id)
        return jsonify({"message": "Berhasil mengambil review produk", "data": data})
    except Exception as error:
        return _error_response(error, "mengambil review produk")


# GET /reviews/<review_id>
def show(review_id):
    try:
        review = review_service.get_review(review_id)
        return jsonify({"message": "Berhasil mengambil review", "data": review})
    except ReviewNotFoundError as error:
        return jsonify({"message": str(error)}), 404
    except Exception as error:
        return _error_response(error, "mengambil review")


# POST /reviews
def store():
    try:
        # silent=True: kalau body bukan JSON yang sah, hasilnya None dan ditolak oleh validasi.
        data = validate_create_review(request.get_json(silent=True))
        review = review_service.create_review(data)
        return jsonify({"message": "Review berhasil dibuat", "data": review}), 201
    except ValidationError as error:
        return _validation_response(error)
    except ProductNotFoundError as error:
        # Produk yang diulas tidak ada di product-service: diperlakukan sebagai data tidak valid.
        return jsonify({
            "message": "Data yang dikirim tidak valid",
            "errors": {"product_id": [str(error)]},
        }), 422
    except ProductServiceUnavailableError as error:
        return _unavailable_response(error)
    except DuplicateReviewError as error:
        return jsonify({"message": str(error)}), 409
    except Exception as error:
        return _error_response(error, "membuat review")


# PUT /reviews/<review_id>
def update(review_id):
    try:
        data = validate_update_review(request.get_json(silent=True))
        review = review_service.update_review(review_id, data)
        return jsonify({"message": "Review berhasil diperbarui", "data": review})
    except ValidationError as error:
        return _validation_response(error)
    except ReviewNotFoundError as error:
        return jsonify({"message": str(error)}), 404
    except Exception as error:
        return _error_response(error, "memperbarui review")


# DELETE /reviews/<review_id>
def destroy(review_id):
    try:
        review_service.delete_review(review_id)
        return jsonify({"message": "Review berhasil dihapus"})
    except ReviewNotFoundError as error:
        return jsonify({"message": str(error)}), 404
    except Exception as error:
        return _error_response(error, "menghapus review")


# 422: data dari client tidak valid, sertakan detail kesalahan per field.
def _validation_response(error):
    return jsonify({"message": str(error), "errors": error.errors}), 422


# 503: review-service sehat, tetapi product-service yang dibutuhkannya sedang bermasalah.
def _unavailable_response(error):
    return jsonify({
        "message": "Layanan pendukung sedang tidak dapat dijangkau",
        "detail": str(error),
    }), 503


def _error_response(error, action):
    current_app.logger.error("Gagal %s: %s\n%s", action, error, traceback.format_exc())
    return jsonify({"message": f"Gagal {action}"}), 500