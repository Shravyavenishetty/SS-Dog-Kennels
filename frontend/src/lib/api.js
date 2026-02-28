const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");
const BACKEND_URL = API_BASE.replace('/api', '');

function getFullUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BACKEND_URL}${url}`;
}

async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchPuppies() {
  const data = await getJson("/puppies/");
  return data.map((p) => ({
    id: p.id,
    breed: p.breed,
    price: p.price,
    priceDisplay: p.price_display || (typeof p.price === "number" ? `INR ${p.price.toLocaleString()}` : ""),
    age: p.age,
    availability: p.availability,
    type: p.dog_type,
    image: getFullUrl(p.image_url),
    images: (p.images || []).map(img => getFullUrl(img.url)),
    tagline: p.tagline,
    behavior: p.behavior,
    health_shield: p.health_shield,
    description: p.description,
    initial_package: p.initial_package,
    elite_protection: p.elite_protection,
  }));
}

export async function fetchStudDogs() {
  const data = await getJson("/stud-dogs/");
  return data.map((s) => ({
    id: s.id,
    name: s.name,
    breed: s.breed,
    rating: Number(s.rating || 0),
    pups: s.pups_produced || 0,
    image: s.image_url,
  }));
}

export async function fetchServiceCategories() {
  const data = await getJson("/services/");
  return data.map((c) => ({
    id: c.id,
    title: c.title,
    tagline: c.tagline,
    image: c.image_url,
    iconName: c.icon_name,
    subServices: (c.sub_services || []).map((s) => s.name),
    priceRange: c.price_range,
  }));
}

export async function fetchTestimonials() {
  const data = await getJson("/testimonials/");
  return data.map((t) => ({
    id: t.id,
    name: t.name,
    text: t.text,
    location: t.location,
    rating: Number(t.rating || 5),
  }));
}

export async function fetchHomeHighlights() {
  const data = await getJson("/home-highlights/");
  return data.map((h) => ({
    id: h.id,
    title: h.title,
    desc: h.description,
    iconName: h.icon_name,
  }));
}

export async function fetchFacilities() {
  const data = await getJson("/facilities/");
  return data.map((f) => ({
    id: f.id,
    title: f.title,
    desc: f.description,
  }));
}

export async function fetchFaqs() {
  const data = await getJson("/faqs/");
  return data.map((f) => ({
    id: f.id,
    q: f.question,
    a: f.answer,
  }));
}

export async function fetchUserProfile(phone) {
  const data = await getJson(`/user-profiles/${phone}/`);
  return {
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone_number,
    createdAt: data.created_at,
  };
}

export async function checkProfile(phone) {
  try {
    const res = await fetch(`${API_BASE}/user-profiles/check/${phone}/`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.exists;
  } catch (e) {
    return false;
  }
}

export async function createProfile(data) {
  const res = await fetch(`${API_BASE}/user-profiles/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone_number: data.phone,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
    }),
  });
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`Failed to create profile: ${res.status}`, errorBody);
    throw new Error(`Failed to create profile: ${res.status}`);
  }
  return res.json();
}

export async function updateUserProfile(phone, data) {
  const res = await fetch(`${API_BASE}/user-profiles/${phone}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
    }),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function deleteProfile(phone) {
  const res = await fetch(`${API_BASE}/user-profiles/${phone}/`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete profile');
  return true; // 204 No Content
}

export async function changeUserPhone(oldPhone, newPhone) {
  const res = await fetch(`${API_BASE}/user-profiles/${oldPhone}/change-phone/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ new_phone: newPhone }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to change phone number');
  }
  return res.json();
}

export async function fetchUserBookings(phone) {
  const data = await getJson(`/bookings/?phone=${phone}`);
  return data.map(b => ({
    id: b.id,
    serviceName: b.service_name,
    date: b.booking_date,
    status: b.status,
    details: b.details,
  }));
}
