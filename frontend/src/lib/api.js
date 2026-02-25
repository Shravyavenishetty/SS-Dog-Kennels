const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");

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
    image: p.image_url,
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
