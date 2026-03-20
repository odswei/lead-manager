"use client";

import { useEffect, useMemo, useState } from "react";

const STATUSES = [
  "New",
  "Engaged",
  "Proposal Sent",
  "Closed-Won",
  "Closed-Lost"
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const initialForm = {
  name: "",
  email: "",
  status: "New"
};

const INITIAL_VISIBLE_LEADS = 4;
const LOAD_MORE_STEP = 4;

function normalizeForSearch(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const SEO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Lead Manager",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "A simple lead tracking dashboard to create and review sales leads by status.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  }
};

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleLeadsCount, setVisibleLeadsCount] = useState(INITIAL_VISIBLE_LEADS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const statusCounts = leads.reduce((accumulator, lead) => {
    accumulator[lead.status] = (accumulator[lead.status] || 0) + 1;
    return accumulator;
  }, {});

  const filteredLeads = useMemo(() => {
    const query = normalizeForSearch(searchTerm);

    if (!query) {
      return leads;
    }

    return leads.filter((lead) => {
      const name = normalizeForSearch(lead.name);
      const email = normalizeForSearch(lead.email);
      const status = normalizeForSearch(lead.status);

      return (
        name.includes(query) ||
        email.includes(query) ||
        status.includes(query)
      );
    });
  }, [leads, searchTerm]);

  const visibleLeads = useMemo(() => {
    return filteredLeads.slice(0, visibleLeadsCount);
  }, [filteredLeads, visibleLeadsCount]);

  async function loadLeads() {
    try {
      setError("");
      const response = await fetch(`${API_URL}/leads`, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data = await response.json();
      setLeads(data);
    } catch (loadError) {
      setError(loadError.message || "Failed to fetch leads");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    setVisibleLeadsCount(INITIAL_VISIBLE_LEADS);
  }, [searchTerm]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create lead");
      }

      setLeads((current) => [data, ...current]);
      setForm(initialForm);
    } catch (submitError) {
      setError(submitError.message || "Failed to create lead");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
  }

  function handleLoadMore() {
    setVisibleLeadsCount((current) => current + LOAD_MORE_STEP);
  }

  return (
    <main className="page-shell" role="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(SEO_SCHEMA)
        }}
      />

      <section className="topbar">
        <div className="topbar-copy">
          <p className="kicker">Lead Workspace</p>
          <h1>Lead Manager</h1>
          <p>Track incoming leads and keep your outreach pipeline organized.</p>
        </div>

        <div className="topbar-stats" aria-label="Lead quick stats">
          <div className="stat-card">
            <span>Total Leads</span>
            <strong>{leads.length}</strong>
          </div>
          <div className="stat-card">
            <span>Engaged</span>
            <strong>{statusCounts.Engaged || 0}</strong>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel panel-form">
          <div className="panel-header panel-header-tight">
            <h2>Add Lead</h2>
            <p>Create a new lead record in the database.</p>
          </div>

          <form className="lead-form" onSubmit={handleSubmit}>
            <label>
              <span>Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
              />
            </label>

            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
              />
            </label>

            <label>
              <span>Status</span>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Lead"}
            </button>
          </form>

          {error ? <p className="error-message">{error}</p> : null}
        </article>

        <article className="panel panel-leads">
          <div className="panel-header">
            <h2>Leads</h2>
            <p>Search and browse all leads, newest first.</p>
          </div>

          <div className="leads-toolbar">
            <input
              className="search-input"
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name, email, or status"
              aria-label="Search leads"
            />
            {searchTerm && (
              <p className="result-count">
                Showing {visibleLeads.length} of {filteredLeads.length} result
                {filteredLeads.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="panel-content">
            {isLoading ? (
              <p className="empty-state">Loading leads...</p>
            ) : leads.length === 0 ? (
              <p className="empty-state">No leads yet. Add the first one from the form.</p>
            ) : filteredLeads.length === 0 ? (
              <p className="empty-state">No leads match your search.</p>
            ) : (
              <>
                <div className="lead-list">
                  {visibleLeads.map((lead) => (
                    <div key={lead._id} className="lead-card">
                      <div className="lead-card-top">
                        <div>
                          <h3>{lead.name}</h3>
                          <p>{lead.email}</p>
                        </div>
                        <span className="status-pill">{lead.status}</span>
                      </div>

                      <p className="timestamp">
                        Added {new Date(lead.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {visibleLeads.length < filteredLeads.length && (
                  <div className="load-more-wrap">
                    <button
                      type="button"
                      className="load-more-button"
                      onClick={handleLoadMore}
                    >
                      Load More Leads
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
