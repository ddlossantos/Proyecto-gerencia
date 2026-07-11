const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let detail = "Error de comunicacion con el servidor";
    try {
      const payload = await response.json();
      detail = payload.detail || detail;
    } catch {
      detail = response.statusText || detail;
    }
    throw new Error(detail);
  }

  return response.json();
}

export const api = {
  getDashboard: () => request("/dashboard"),
  getDepartments: () => request("/departments"),
  createDepartment: (payload) => request("/departments", { method: "POST", body: JSON.stringify(payload) }),
  getEmployees: (params = {}) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") search.set(key, value);
    });
    return request(`/employees?${search.toString()}`);
  },
  getEmployeeOptions: () => request("/employees/options"),
  getVacancies: () => request("/vacancies"),
  getEvaluations: (params = {}) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") search.set(key, value);
    });
    return request(`/evaluations?${search.toString()}`);
  },
  createEmployee: (payload) => request("/employees", { method: "POST", body: JSON.stringify(payload) }),
  getRecentRecords: () => request("/records/recent"),
  recordAttendance: (payload) => request("/attendance", { method: "POST", body: JSON.stringify(payload) }),
  recordAbsence: (payload) => request("/absences", { method: "POST", body: JSON.stringify(payload) }),
  recordVacation: (payload) => request("/vacations", { method: "POST", body: JSON.stringify(payload) }),
  recordTraining: (payload) => request("/trainings", { method: "POST", body: JSON.stringify(payload) }),
  recordEvaluation: (payload) => request("/evaluations", { method: "POST", body: JSON.stringify(payload) }),
  recordMovement: (payload) => request("/movements", { method: "POST", body: JSON.stringify(payload) }),
  recordTermination: (payload) => request("/terminations", { method: "POST", body: JSON.stringify(payload) }),
  getRecruitment: () => request("/recruitment"),
  seed: (reset = false) => request(`/seed?reset=${reset}&employees=300`, { method: "POST" }),
};
