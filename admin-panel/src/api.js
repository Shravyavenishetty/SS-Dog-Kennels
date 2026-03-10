const BASE = 'http://localhost:8000/api';

async function request(method, path, body) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body !== undefined) opts.body = JSON.stringify(body);
    const res = await fetch(BASE + path, opts);
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || JSON.stringify(err));
    }
    if (res.status === 204) return null;
    return res.json();
}

export const api = {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    patch: (path, body) => request('PATCH', path, body),
    put: (path, body) => request('PUT', path, body),
    delete: (path) => request('DELETE', path),
};

// ---- helpers for each resource ----
export const puppiesApi = {
    list: () => api.get('/puppies/'),
    create: (data) => api.post('/puppies/', data),
    update: (id, d) => api.patch(`/puppies/${id}/`, d),
    delete: (id) => api.delete(`/puppies/${id}/`),
};
export const puppyImagesApi = {
    list: (puppyId) => api.get(`/puppy-images/?puppy=${puppyId}`),
    create: (data) => api.post('/puppy-images/', data),
    delete: (id) => api.delete(`/puppy-images/${id}/`),
};
export const puppyVideosApi = {
    list: (puppyId) => api.get(`/puppy-videos/?puppy=${puppyId}`),
    create: (data) => api.post('/puppy-videos/', data),
    delete: (id) => api.delete(`/puppy-videos/${id}/`),
};

export const studDogsApi = {
    list: () => api.get('/stud-dogs/'),
    create: (data) => api.post('/stud-dogs/', data),
    update: (id, d) => api.patch(`/stud-dogs/${id}/`, d),
    delete: (id) => api.delete(`/stud-dogs/${id}/`),
};
export const studAvailabilityApi = {
    list: () => api.get('/stud-availability/'),
    create: (data) => api.post('/stud-availability/', data),
    delete: (id) => api.delete(`/stud-availability/${id}/`),
};
export const studBookingsApi = {
    list: () => api.get('/stud-booking-requests/'),
    update: (id, data) => api.patch(`/stud-booking-requests/${id}/`, data),
};
export const servicesApi = {
    list: () => api.get('/services/'),
    create: (data) => api.post('/services/', data),
    update: (id, d) => api.patch(`/services/${id}/`, d),
    delete: (id) => api.delete(`/services/${id}/`),
};
export const subServicesApi = {
    list: () => api.get('/sub-services/'),
    create: (data) => api.post('/sub-services/', data),
    delete: (id) => api.delete(`/sub-services/${id}/`),
};
export const bookingsApi = {
    list: () => api.get('/bookings/'),
    update: (id, data) => api.patch(`/bookings/${id}/`, data),
    delete: (id) => api.delete(`/bookings/${id}/`),
};
export const usersApi = {
    list: () => api.get('/user-profiles/'),
    delete: (phone) => api.delete(`/user-profiles/${phone}/`),
};
export const testimonialsApi = {
    list: () => api.get('/testimonials/'),
    create: (data) => api.post('/testimonials/', data),
    update: (id, d) => api.patch(`/testimonials/${id}/`, d),
    delete: (id) => api.delete(`/testimonials/${id}/`),
};
export const highlightsApi = {
    list: () => api.get('/home-highlights/'),
    create: (data) => api.post('/home-highlights/', data),
    update: (id, d) => api.patch(`/home-highlights/${id}/`, d),
    delete: (id) => api.delete(`/home-highlights/${id}/`),
};
export const facilitiesApi = {
    list: () => api.get('/facilities/'),
    create: (data) => api.post('/facilities/', data),
    update: (id, d) => api.patch(`/facilities/${id}/`, d),
    delete: (id) => api.delete(`/facilities/${id}/`),
};
export const faqsApi = {
    list: () => api.get('/faqs/'),
    create: (data) => api.post('/faqs/', data),
    update: (id, d) => api.patch(`/faqs/${id}/`, d),
    delete: (id) => api.delete(`/faqs/${id}/`),
};
export const kennelDetailApi = {
    list: () => api.get('/kennel-details/'),
    create: (data) => api.post('/kennel-details/', data),
    update: (id, d) => api.patch(`/kennel-details/${id}/`, d),
};
export const contactInquiriesApi = {
    list: () => api.get('/contact-inquiries/'),
    delete: (id) => api.delete(`/contact-inquiries/${id}/`),
};
export const puppyInquiriesApi = {
    list: () => api.get('/puppy-inquiries/'),
    delete: (id) => api.delete(`/puppy-inquiries/${id}/`),
};
export const statsApi = {
    get: () => api.get('/admin-stats/'),
};
