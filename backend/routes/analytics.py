from flask import Blueprint
from services.analytics_service import (
    get_hourly_chat_activity,
    get_weekly_chat_activity,
    get_language_distribution,
    get_quick_stats
)
from utils import create_response
from middleware import admin_required
from utils.logger import STATUS
import os

analytics_bp = Blueprint("analytics", __name__)

@analytics_bp.route("/hourly-activity", methods=["GET"])
@admin_required
def hourly_activity(current_admin):
    """Get hourly chat activity for the last 24 hours"""
    try:
        activity = get_hourly_chat_activity()
        return create_response(True, activity, "Hourly activity retrieved successfully", 200)
    except Exception as e:
        return create_response(False, message=str(e), status=500)

@analytics_bp.route("/weekly-activity", methods=["GET"])
@admin_required
def weekly_activity(current_admin):
    """Get weekly chat activity"""
    try:
        activity = get_weekly_chat_activity()
        return create_response(True, activity, "Weekly activity retrieved successfully", 200)
    except Exception as e:
        return create_response(False, message=str(e), status=500)

@analytics_bp.route("/language-distribution", methods=["GET"])
@admin_required
def language_distribution(current_admin):
    """Get chat distribution by programming language"""
    try:
        distribution = get_language_distribution()
        return create_response(True, distribution, "Language distribution retrieved successfully", 200)
    except Exception as e:
        return create_response(False, message=str(e), status=500)

@analytics_bp.route("/quick-stats", methods=["GET"])
@admin_required
def quick_stats(current_admin):
    """Get quick statistics about the chat system"""
    try:
        stats = get_quick_stats()
        return create_response(True, stats, "Quick stats retrieved successfully", 200)
    except Exception as e:
        return create_response(False, message=str(e), status=500)

@analytics_bp.route("/indexing-status", methods=["GET"])
@admin_required
def indexing_status(current_admin):
    """Get current indexing status and logs"""
    try:
        logs = []
        if STATUS["logs"] and os.path.exists(STATUS["logs"]):
            with open(STATUS["logs"], 'r') as f:
                logs = f.readlines()
        
        return create_response(True, {
            "running": STATUS["running"],
            "last_run": STATUS["last_run"],
            "folder": STATUS["folder"],
            "logs": logs
        }, "Indexing status retrieved successfully", 200)
    except Exception as e:
        return create_response(False, message=str(e), status=500) 