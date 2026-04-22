"use client"

/**
 * ============================================
 * ADMIN APPOINTMENTS DASHBOARD - EXAMPLE
 * ============================================
 * 
 * This is a complete, production-ready example
 * showing how to integrate all the created
 * stores, hooks, and utilities.
 * 
 * Copy this pattern for other dashboard pages!
 */

import { useState, useCallback } from "react"
import { useAppointments } from "@/lib/hooks/use-data"
import {
  formatDate,
  formatTime,
  parseApiError,
  debounce,
} from "@/lib/utils/data-utils"
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

export default function AdminAppointmentsDashboard() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [filters, setFilters] = useState<AppointmentsFilters>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  })

  const [showModal, setShowModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // ============================================
  // DATA FETCHING
  // ============================================

  const {
    appointments,
    loading,
    error: apiError,
    totalPages,
    currentPage,
    updateAppointmentStatus,
    deleteAppointment,
  } = useAppointments(filters)

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      setFilters((prev) => ({
        ...prev,
        search: searchTerm,
        page: 1,
      }))
    }, 300),
    []
  )

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status,
      page: 1,
    }))
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setFilters((prev) => ({
        ...prev,
        page: newPage,
      }))
    }
  }

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return
    }

    try {
      await deleteAppointment(id)
      setSuccessMessage("Appointment deleted successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setErrorMessage(parseApiError(err))
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateAppointmentStatus(id, newStatus)
      setSuccessMessage(`Appointment status updated to ${newStatus}`)
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setErrorMessage(parseApiError(err))
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedAppointment(null)
    setIsEditing(false)
  }

  // ============================================
  // RENDER: LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="appointments-container">
        <div className="loading-skeleton">
          <div className="skeleton-header" />
          <div className="skeleton-table">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton-row" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ============================================
  // RENDER: ERROR STATE
  // ============================================

  if (apiError) {
    return (
      <div className="appointments-container">
        <div className="error-alert">
          <h3>Error Loading Appointments</h3>
          <p>{apiError}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    )
  }

  // ============================================
  // RENDER: MAIN CONTENT
  // ============================================

  return (
    <div className="appointments-container">
      {/* ========== HEADER ========== */}
      <div className="appointments-header">
        <div className="header-left">
          <h1>Appointments Management</h1>
          <p className="subtitle">Manage all patient appointments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          New Appointment
        </button>
      </div>

      {/* ========== ALERTS ========== */}
      {successMessage && (
        <div className="alert alert-success">
          ✅ {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger">
          ❌ {errorMessage}
        </div>
      )}

      {/* ========== FILTERS ========== */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by patient name, doctor name, or ID..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="NO_SHOW">No Show</option>
        </select>

        <div className="filter-info">
          Showing {appointments.length} of {totalPages * filters.limit} appointments
        </div>
      </div>

      {/* ========== TABLE ========== */}
      <div className="table-wrapper">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date & Time</th>
              <th>Type</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={7}>
                  <div className="empty-state">
                    <p>No appointments found</p>
                    <button onClick={() => setShowModal(true)}>Create First Appointment</button>
                  </div>
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr key={appointment.id} className="appointment-row">
                  <td>
                    <div className="cell-content">
                      <span className="patient-name">{appointment.patientName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">
                      <span className="doctor-name">{appointment.doctorName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">
                      <span>{formatDate(appointment.appointmentDate)}</span>
                      <span className="time">{formatTime(appointment.appointmentTime)}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {appointment.consultationType === "ONLINE" ? "🌐 Online" : "🏥 Offline"}
                    </span>
                  </td>
                  <td>
                    <select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                      className={`status-select ${getStatusBadgeClass(appointment.status)}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="NO_SHOW">No Show</option>
                    </select>
                  </td>
                  <td>
                    <span className="duration">{appointment.duration}m</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        title="Edit"
                        onClick={() => handleEdit(appointment)}
                        className="btn-icon btn-edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(appointment.id)}
                        className="btn-icon btn-delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ========== PAGINATION ========== */}
      {totalPages > 1 && (
        <div className="pagination-section">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-sm"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>

          <div className="page-buttons">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`page-btn ${currentPage === pageNum ? "active" : ""}`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-sm"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ========== MODAL ========== */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? "Edit Appointment" : "New Appointment"}</h2>
              <button onClick={handleCloseModal} className="btn-close">
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* 
                ========== FORM IMPLEMENTATION ==========
                Add your form component here:
                <AppointmentForm
                  appointment={selectedAppointment}
                  isEditing={isEditing}
                  onClose={handleCloseModal}
                  onSuccess={() => {
                    setSuccessMessage("Success!")
                    handleCloseModal()
                  }}
                />
              */}
              <p style={{ textAlign: "center", color: "#999" }}>
                Form component would go here
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========== STYLES ========== */}
      <style jsx>{`
        .appointments-container {
          padding: 2rem;
          background: #f5f7fa;
          min-height: 100vh;
        }

        .appointments-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .header-left h1 {
          margin: 0;
          font-size: 1.75rem;
          color: #1a1a1a;
        }

        .subtitle {
          margin: 0.5rem 0 0;
          color: #666;
          font-size: 0.9rem;
        }

        .alert {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          animation: slideDown 0.3s ease;
        }

        .alert-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .alert-danger {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .filters-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f5f7fa;
          padding: 0 1rem;
          border-radius: 6px;
        }

        .search-box input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.75rem 0;
          font-size: 0.9rem;
          outline: none;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          cursor: pointer;
        }

        .filter-info {
          display: flex;
          align-items: center;
          color: #666;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .table-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
          margin-bottom: 2rem;
        }

        .appointments-table {
          width: 100%;
          border-collapse: collapse;
        }

        .appointments-table th {
          background: #f5f7fa;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #1a1a1a;
          border-bottom: 1px solid #ddd;
        }

        .appointments-table td {
          padding: 1rem;
          border-bottom: 1px solid #ddd;
        }

        .appointment-row:hover {
          background: #f9f9f9;
        }

        .cell-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .patient-name,
        .doctor-name {
          font-weight: 500;
          color: #1a1a1a;
        }

        .time {
          font-size: 0.85rem;
          color: #666;
        }

        .badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .badge-info {
          background: #e7f3ff;
          color: #0066cc;
        }

        .status-select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .duration {
          color: #666;
          font-size: 0.9rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          padding: 0.5rem;
          background: #f5f7fa;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-icon:hover {
          background: #e0e0e0;
        }

        .btn-edit:hover {
          color: #0066cc;
        }

        .btn-delete:hover {
          color: #d9534f;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #999;
        }

        .pagination-section {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .page-info {
          color: #666;
          font-size: 0.9rem;
        }

        .page-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .page-btn {
          padding: 0.5rem 0.75rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
        }

        .page-btn.active {
          background: #0066cc;
          color: white;
          border-color: #0066cc;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: #0066cc;
          color: white;
        }

        .btn-primary:hover {
          background: #0052a3;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #ddd;
          position: sticky;
          top: 0;
          background: white;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }

        .btn-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .loading-skeleton,
        .skeleton-row {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .appointments-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .filters-section {
            flex-direction: column;
          }

          .appointments-table {
            font-size: 0.9rem;
          }

          .appointments-table th,
          .appointments-table td {
            padding: 0.75rem 0.5rem;
          }

          .pagination-section {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  )
}
