const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";

const CLIENT_ID_KEY = "skillbridge_client_id";

function getClientId() {
  let clientId = localStorage.getItem(CLIENT_ID_KEY);

  if (!clientId) {
    clientId =
      "client-" +
      Date.now() +
      "-" +
      Math.random().toString(36).slice(2);

    localStorage.setItem(CLIENT_ID_KEY, clientId);
  }

  return clientId;
}

function getToken() {
  return localStorage.getItem("skillbridge_token");
}

async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(
    `${API_BASE}${endpoint}`,
    {
      ...options,
      headers
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("skillbridge_token");
      localStorage.removeItem("skillbridge_user");
    }

    throw new Error(
      data.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

/* =========================================================
   HEALTH
========================================================= */

export async function getHealth() {
  return request("/health");
}

/* =========================================================
   AUTH
========================================================= */

export async function registerUser(payload) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (data.token) {
    localStorage.setItem(
      "skillbridge_token",
      data.token
    );
  }

  if (data.user) {
    localStorage.setItem(
      "skillbridge_user",
      JSON.stringify(data.user)
    );
  }

  return data;
}

export async function loginUser(email, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });

  if (data.token) {
    localStorage.setItem(
      "skillbridge_token",
      data.token
    );
  }

  if (data.user) {
    localStorage.setItem(
      "skillbridge_user",
      JSON.stringify(data.user)
    );
  }

  return data;
}

export function logoutUser() {
  localStorage.removeItem("skillbridge_token");
  localStorage.removeItem("skillbridge_user");
}

export async function getCurrentUser() {
  return request("/auth/me");
}

export async function updateProfile(payload) {
  return request("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

/* =========================================================
   RESUMES
========================================================= */

export async function getResumes() {
  const data = await request("/resumes");

  return Array.isArray(data)
    ? data
    : data.resumes || [];
}

export async function getResume(id) {
  return request(`/resumes/${id}`);
}

export async function uploadResume(
  file,
  targetRole,
  userId
) {
  const formData = new FormData();

  formData.append("resume", file);
  formData.append(
    "targetRole",
    targetRole || "AI/ML Engineer"
  );

  if (userId) {
    formData.append("userId", userId);
  }

  return request("/resumes/upload", {
    method: "POST",
    body: formData
  });
}

export async function saveResume(payload) {
  return request("/resumes", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function createResume(payload) {
  return saveResume(payload);
}

export async function updateResume(id, payload) {
  return request(`/resumes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function deleteResume(id) {
  return request(`/resumes/${id}`, {
    method: "DELETE"
  });
}

/* =========================================================
   JOBS
========================================================= */

export async function getJobs(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        query.append(key, value);
      }
    }
  );

  const suffix = query.toString()
    ? `?${query.toString()}`
    : "";

  const data = await request(`/jobs${suffix}`);

  return Array.isArray(data)
    ? data
    : data.jobs || [];
}

export async function getTrendingSkills() {
  const data = await request(
    "/jobs/trending-skills"
  );

  return Array.isArray(data)
    ? data
    : data.skills || [];
}

/* =========================================================
   AI
========================================================= */

export async function analyzeResumeWithAI(payload) {
  return request("/ai/resume", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function aiReview(payload) {
  return analyzeResumeWithAI(payload);
}

export async function askCareerAssistant(message, context = {}) {
  return request("/ai/chat", {
    method: "POST",
    body: JSON.stringify({
      message,
      context
    })
  });
}

export async function aiAssistant(message, context = {}) {
  return askCareerAssistant(
    message,
    context
  );
}

export async function sendAIMessage(message, context = {}) {
  return askCareerAssistant(
    message,
    context
  );
}

/* =========================================================
   ROLE ASSESSMENT
========================================================= */

export async function getAssessmentRoles() {
  const data = await request(
    "/assessment/roles"
  );

  return data.roles || [];
}

export async function getAssessmentQuestions(
  role
) {
  const data = await request(
    `/assessment/questions/${encodeURIComponent(
      role
    )}`
  );

  return data.questions || [];
}

export async function submitAssessment(
  role,
  answers,
  durationSeconds
) {
  return request("/assessment/submit", {
    method: "POST",
    body: JSON.stringify({
      role,
      answers,
      durationSeconds
    })
  });
}

export async function getAssessmentHistory() {
  const data = await request(
    "/assessment/history"
  );

  return data.assessments || [];
}

export async function getAssessmentResult(id) {
  return request(
    `/assessment/${id}`
  );
}

export { API_BASE, getClientId };