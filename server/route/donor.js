import express from "express";
const router = express.Router();
import pool from "../config/db.js";

router.post("/add", async (req, res) => {
  try {
    const {
      name,
      email,
      gender,
      dob,
      college_student_id,
      department_id,
      college_id,
      year_id,
      state,
      address,
      blood_group_id,
      weight,
      last_donated_date,
      health_decleration,
      available,
      status,
      phone,
    } = req.body;

    if (!name || !email || !phone || !blood_group_id) {
      return res.status(400).json({
        status: "error",
        message: "Required fields missing: name, email, phone, blood_group_id",
      });
    }

    const emailCheck = await pool.query(
      "SELECT id FROM donors WHERE email = $1 AND is_active = 'Y'",
      [email]
    );

    // if (emailCheck.rows.length === 0) {
    //   return res.status(400).json({
    //     status: "error",
    //     message: "Register to proceed!",
    //   });
    // }

    const result = await pool.query(
      `INSERT INTO donors (
        name,
        email,
        gender,
        dob,
        college_student_id,
        department_id,
        college_id,
        year_id,
        state,
        address,
        blood_group_id,
        weight,
        last_donated_date,
        health_decleration,
        available,
        status,
        phone,
        is_active,
        created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, 'Y', NOW()
      ) RETURNING *`,
      [
        name,
        email,
        gender,
        dob,
        college_student_id,
        department_id,
        college_id,
        year_id,
        state,
        address,
        blood_group_id,
        weight,
        last_donated_date || null,
        health_decleration,
        available || 'Y',
        status || 'P',
        phone,
      ]
    );

    res.json({
      status: "success",
      message: "Donor registered successfully. Awaiting admin approval.",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error in donor registration:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to register donor",
      error: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
        d.*,
        bg.name as blood_group_name,
        c.name as college_name,
        dep.name as department_name,
        y.name as year_name
      FROM donors d
      LEFT JOIN bloodgroup bg ON bg.id = d.blood_group_id
      LEFT JOIN college c ON c.id = d.college_id
      LEFT JOIN department dep ON dep.id = d.department_id
      LEFT JOIN year y ON y.id = d.year_id
      WHERE d.id = $1 AND d.is_active = 'Y'`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Donor not found",
      });
    }

    res.json({
      status: "success",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error fetching donor:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch donor",
      error: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const { blood_group_id, status, available, college_id } = req.query;

    let query = `
      SELECT
        d.*,
        bg.name as blood_group_name,
        c.name as college_name,
        dep.name as department_name,
        y.name as year_name
      FROM donors d
      LEFT JOIN bloodgroup bg ON bg.id = d.blood_group_id
      LEFT JOIN college c ON c.id = d.college_id
      LEFT JOIN department dep ON dep.id = d.department_id
      LEFT JOIN year y ON y.id = d.year_id
      WHERE d.is_active = 'Y'
    `;

    const queryParams = [];
    let paramIndex = 1;

    if (blood_group_id) {
      query += ` AND d.blood_group_id = $${paramIndex}`;
      queryParams.push(blood_group_id);
      paramIndex++;
    }

    if (status) {
      query += ` AND d.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (available) {
      query += ` AND d.available = $${paramIndex}`;
      queryParams.push(available);
      paramIndex++;
    }

    if (college_id) {
      query += ` AND d.college_id = $${paramIndex}`;
      queryParams.push(college_id);
      paramIndex++;
    }

    query += ` ORDER BY d.created_at DESC`;

    const result = await pool.query(query, queryParams);

    res.json({
      status: "success",
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error("Error fetching donors:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch donors",
      error: err.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      gender,
      dob,
      college_student_id,
      department_id,
      college_id,
      year_id,
      state,
      address,
      blood_group_id,
      weight,
      last_donated_date,
      health_decleration,
      available,
      status,
      phone,
    } = req.body;

    const result = await pool.query(
      `UPDATE donors SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        gender = COALESCE($3, gender),
        dob = COALESCE($4, dob),
        college_student_id = COALESCE($5, college_student_id),
        department_id = COALESCE($6, department_id),
        college_id = COALESCE($7, college_id),
        year_id = COALESCE($8, year_id),
        state = COALESCE($9, state),
        address = COALESCE($10, address),
        blood_group_id = COALESCE($11, blood_group_id),
        weight = COALESCE($12, weight),
        last_donated_date = COALESCE($13, last_donated_date),
        health_decleration = COALESCE($14, health_decleration),
        available = COALESCE($15, available),
        status = COALESCE($16, status),
        phone = COALESCE($17, phone)
      WHERE id = $18 AND is_active = 'Y'
      RETURNING *`,
      [
        name,
        email,
        gender,
        dob,
        college_student_id,
        department_id,
        college_id,
        year_id,
        state,
        address,
        blood_group_id,
        weight,
        last_donated_date,
        health_decleration,
        available,
        status,
        phone,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Donor not found",
      });
    }

    res.json({
      status: "success",
      message: "Donor updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating donor:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to update donor",
      error: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE donors SET is_active = 'N' WHERE id = $1 AND is_active = 'Y' RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Donor not found",
      });
    }

    res.json({
      status: "success",
      message: "Donor deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting donor:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to delete donor",
      error: err.message,
    });
  }
});

router.patch("/:id/availability", async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;

    if (!available || !["Y", "N"].includes(available)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid availability status. Must be 'Y' or 'N'",
      });
    }

    const result = await pool.query(
      "UPDATE donors SET available = $1 WHERE id = $2 AND is_active = 'Y' RETURNING *",
      [available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Donor not found",
      });
    }

    res.json({
      status: "success",
      message: "Availability updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating availability:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to update availability",
      error: err.message,
    });
  }
});

router.patch("/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE donors SET status = 'A' WHERE id = $1 AND is_active = 'Y' RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Donor not found",
      });
    }

    res.json({
      status: "success",
      message: "Donor approved successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error approving donor:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to approve donor",
      error: err.message,
    });
  }
});

router.patch("/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE donors SET status = 'R' WHERE id = $1 AND is_active = 'Y' RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Donor not found",
      });
    }

    res.json({
      status: "success",
      message: "Donor rejected successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error rejecting donor:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to reject donor",
      error: err.message,
    });
  }
});


router.post("blood_requests",async (req,res)=>{

  try{
      const {
        blood_group_id,
        units_required,
        urgency_level,
        patient_name,
        contact_person,
        contact_number,
        hospital_name,
        additional_info,
      } = req.body;

      if (!blood_group_id || !units_required || !urgency_level || !patient_name || !contact_person || !contact_number || !hospital_name) {
        return res.status(400).json({
          status: "error",
          message: "Required fields missing: blood_group_id, units_required, urgency_level, patient_name, contact_person, contact_number, hospital_name",
        });
      }
    }catch(err){}

});

export default router;