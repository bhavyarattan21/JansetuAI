import { supabase } from "./supabase";
import { uploadComplaintPhoto } from "./photos";

/**
 * Inserts 5 clearly labelled demo complaints with relative dates for the current user
 */
export async function loadDemoScenario(userId) {
  if (!supabase || !userId) throw new Error("Active user session required for demo data");

  const now = new Date();
  
  // Date helpers
  const daysAgo = (days) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d.toISOString();
  };

  const daysAhead = (days) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  const demoRecords = [
    // 1. Draft
    {
      user_id: userId,
      category: "Roads & Potholes",
      department: "Public Works Department (PWD)",
      portal_name: "CPGRAMS / Haryana SARAL",
      location: "Sector 4 Main Road near Community Centre, Sohna",
      description: "Severe pothole cluster causing frequent two-wheeler skids and traffic congestion during evening commute hours.",
      draft_letter: "To the Executive Engineer, PWD Sohna...\nRequesting urgent patch repair of the 15-meter pothole stretch near Community Centre.",
      urgency: "medium",
      status: "draft",
      portal_reference: null,
      filed_at: null,
      expected_by: null,
      is_demo: true,
      is_archived: false
    },
    // 2. Filed (In Progress, filed 5 days ago, expected in 9 days)
    {
      user_id: userId,
      category: "Water Supply",
      department: "Public Health Engineering Department (PHED)",
      portal_name: "Haryana Jan Sahayak Portal",
      location: "Ward 8, Old Sohna Town",
      description: "Low water pipeline pressure and intermittent brown water supply during the morning 6 AM - 8 AM distribution window.",
      draft_letter: "Formal grievance regarding contaminated water supply and pressure drop in Ward 8 pipeline.",
      urgency: "high",
      status: "filed",
      portal_reference: "HR-PHED-2026-9042",
      filed_at: daysAgo(5),
      expected_by: daysAhead(9),
      is_demo: true,
      is_archived: false
    },
    // 3. Overdue (Filed 13 days ago, SLA was 7 days, so overdue by 6 days)
    {
      user_id: userId,
      category: "Street Lighting",
      department: "Municipal Council Sohna",
      portal_name: "Municipal Grievance Cell",
      location: "Badshahpur-Sohna Link Road Stretch",
      description: "Four consecutive solar streetlights have been completely non-functional for two weeks, creating safety hazard for pedestrians at night.",
      draft_letter: "Urgent requisition for replacement of LED luminaire and battery inspection along Link Road stretch.",
      urgency: "high",
      status: "filed",
      portal_reference: "MC-SOHNA-2026-3184",
      filed_at: daysAgo(13),
      expected_by: daysAgo(6), // Expected 6 days ago -> overdue!
      is_demo: true,
      is_archived: false
    },
    // 4. Escalated (Filed 20 days ago, escalated via First Appeal)
    {
      user_id: userId,
      category: "Waste Management",
      department: "Sanitation & Solid Waste Management",
      portal_name: "Swachhata Citizen App",
      location: "Opposite Grain Market Gate 2, Sohna",
      description: "Overflowing secondary waste container spreading garbage onto road carriageway, blocking pedestrian access.",
      draft_letter: "First Appeal under Section 19(1) of RTI Act regarding neglected garbage clearing notices issued to contractor.",
      urgency: "high",
      status: "escalated",
      portal_reference: "SWACHH-HR-2026-7810",
      filed_at: daysAgo(20),
      expected_by: daysAgo(10),
      is_demo: true,
      is_archived: false
    },
    // 5. Resolved (Citizen confirmed resolution on ground)
    {
      user_id: userId,
      category: "Drainage & Sewerage",
      department: "Municipal Council Sohna",
      portal_name: "CPGRAMS",
      location: "Railway Station Approach Road, Sohna",
      description: "Blocked storm water drain causing monsoon waterlogging up to knee level during moderate rainfall.",
      draft_letter: "Citizen confirmed drain desilting completed by suction machine crew on site.",
      urgency: "medium",
      status: "resolved",
      portal_reference: "CPGRAMS-2026-4419",
      filed_at: daysAgo(25),
      expected_by: daysAgo(15),
      resolved_at: daysAgo(2),
      is_demo: true,
      is_archived: false
    }
  ];

  // Insert the 5 demo records
  const { data, error } = await supabase
    .from("complaints")
    .insert(demoRecords)
    .select();

  if (error) {
    console.error("loadDemoScenario error:", error);
    throw error;
  }

  // Insert initial events for each
  for (const c of (data || [])) {
    await supabase.from("complaint_events").insert({
      complaint_id: c.id,
      type: c.status === "escalated" ? "escalated" : (c.status === "resolved" ? "resolved" : (c.status === "filed" ? "filed" : "created")),
      note: c.status === "escalated" 
        ? "RTI First Appeal lodged due to expired statutory SLA"
        : (c.status === "resolved" ? "Citizen verified resolution on ground" : `Status: ${c.status}`)
    });
  }

  // Upload genuine water crisis evidence photo for the Water Supply complaint
  const waterComplaint = (data || []).find((c) => c.category === "Water Supply");
  if (waterComplaint) {
    try {
      const res = await fetch("/demo-water-crisis.webp");
      if (res.ok) {
        const blob = await res.blob();
        await uploadComplaintPhoto({
          userId,
          complaintId: waterComplaint.id,
          fileOrBlobOrDataUrl: blob,
          kind: "before"
        });
      }
    } catch (photoErr) {
      console.warn("Demo water crisis photo upload notice:", photoErr);
    }
  }

  return data;
}

/**
 * Removes all demo records for the current user
 */
export async function removeDemoData(userId) {
  if (!supabase || !userId) return;
  const { error } = await supabase
    .from("complaints")
    .delete()
    .eq("user_id", userId)
    .eq("is_demo", true);

  if (error) {
    console.error("removeDemoData error:", error);
    throw error;
  }
}
