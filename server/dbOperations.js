import pool from "./db.js";

export const insertFreightRate = async (dataArray) => {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    throw new Error("Input must be a non-empty array of objects.");
  }

  const keys = Object.keys(dataArray[0]); // assuming all objects have same keys
  const columns = keys.join(", "); // e.g. origin_port, destination_port, ...

  const values = [];
  const placeholders = dataArray.map((item, rowIndex) => {
    const rowPlaceholders = keys.map((_, colIndex) => {
      const valueIndex = rowIndex * keys.length + colIndex + 1;
      return `$${valueIndex}`;
    });
    values.push(
      ...keys.map((key) => {
        return item[key];
      })
    ); // flatten values
    return `(${rowPlaceholders.join(", ")})`;
  });
  await pool.query("SET DateStyle = 'ISO, DMY';");

  const query = `INSERT INTO freight_rates (${columns}) VALUES ${placeholders.join(
    ", "
  )} RETURNING *`;

  try {
    const result = await pool.query(query, values);
    return {
      status: true,
      message: `${result.rows.length} rows inserted successfully`,
    };
  } catch (error) {
    console.error("Bulk insert failed:", error);
    throw error;
  }
};

export const get = async () => {
  await pool.query("SET DateStyle = 'ISO, DMY';");
  const query = `SELECT * FROM freight_rates order by id desc`;
  try {
    const result = await pool.query(query);

    return result.rows;
  } catch (error) {
    throw error;
  }
};
