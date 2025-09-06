const express = require('express');
const cors = require('cors')
const sql = require('mysql2')
// const bodyParser= require('body-parser')

//initialization
const app = express()
const port = 5000

//middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())

//DB connect
const pool = sql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "bus_ticketing",
    multipleStatements: true
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    } else {
        console.log('Database connected successfully');
        connection.release();
    }
});


//---------------------------api

app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try {
        await pool.promise().query(
            'insert into accounts (email, full_name) values (?, ?)',
            [email, name]
        );
        await pool.promise().query(
            'insert into users (user_email) values (?)',
            [email]
        );
        res.send({ message: 'User inserted successfully', user_info: { name, email } });
    } catch (err) {
        res.send({ message: 'database error' });
    }
});

app.get('/accounts/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const [userRows] = await pool.promise().query('select * from accounts where email = ?', [email]);
        if (userRows.length === 0) {
            return res.send({ message: 'user not found' });
        }
        const [adminRows] = await pool.promise().query('select * from admins where admin_email = ?', [email]);
        const isAdmin = adminRows.length > 0;
        const user = userRows[0];

        if (!isAdmin) {
            const [userDetails] = await pool.promise().query('select * from users where user_email = ?', [email]);
            user.loyalty_points = userDetails[0]?.loyalty_points || 0;
            user.auto_booking_enabled = userDetails[0]?.auto_booking_enabled || 0;
            user.total_seats_booked = userDetails[0]?.total_seats_booked || 0;
        }

        user.isAdmin = isAdmin;
        res.send(user);
    } catch (err) {
        console.error('database error:', err);
        res.send({ message: 'error' });
    }
});


app.patch('/accounts/update-balance/:email', async (req, res) => {
    const { email } = req.params;
    const { ewallet_balance } = req.body;

    try {
        await pool.promise().query(
            'update accounts set ewallet_balance = ? where email = ?',
            [ewallet_balance, email]
        );
        res.send({ ewallet_balance });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Database error' });
    }
});


app.get('/promo-codes', async (req, res) => {
    const { code } = req.query;

    try {
        if (code) {
            const [rows] = await pool.promise().query(
                `SELECT * FROM promo_codes WHERE code = ? AND active = true`,
                [code]
            );
            return res.json(rows[0] || {});
        } else {
            const [rows] = await pool.promise().query(
                `SELECT * FROM promo_codes WHERE active = true`
            );
            return res.json(rows);
        }
    } catch (err) {
        console.error(err);
        res.json({ error: 'database error' });
    }
});


app.delete("/promo-codes", async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.json({ message: "Promo code is required" });
    }

    try {
        const [result] = await pool.promise().query(
            "DELETE FROM promo_codes WHERE code = ?",
            [code]
        );

        if (result.affectedRows === 0) {
            return res.json({ message: "Promo code not found" });
        }

        res.json({ message: "Promo code deleted successfully" });
    } catch (err) {
        console.error("Error deleting promo code:", err);
        res.json({ message: "Failed to delete promo code" });
    }
});


app.patch('/promo-codes', async (req, res) => {
    const { code } = req.query;
    const {
        description,
        type,
        discount_value,
        min_total_seats,
        per_user_limit,
        global_max_uses,
        start_at,
        expires_at,
        combinable,
        active
    } = req.body;

    if (!code) return res.json({ error: 'Promo code is required' });

    try {
        const [result] = await pool.promise().query(
            `UPDATE promo_codes SET 
                description = ?, 
                type = ?, 
                discount_value = ?, 
                min_total_seats = ?, 
                start_at = ?, 
                expires_at = ?, 
                active = ? 
             WHERE code = ?`,
            [
                description,
                type,
                discount_value,
                min_total_seats,
                start_at,
                expires_at,
                active,
                code
            ]
        );

        res.json({ modifiedCount: result.affectedRows });
    } catch (err) {
        console.error(err);
        res.json({ error: 'Database error' });
    }
});

app.post('/promo-codes', async (req, res) => {
    try {
        const {
            code,
            description,
            type,
            discount_value,
            min_total_seats,
            start_at,
            expires_at,
            active
        } = req.body;

        if (!code || !description || !type || !discount_value) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const [result] = await pool.promise().query(
            `INSERT INTO promo_codes 
        (code, description, type, discount_value, min_total_seats, start_at, expires_at, active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                code,
                description,
                type,
                discount_value,
                min_total_seats || 0,
                start_at || null,
                expires_at || null,
                active || 0
            ]
        );

        res.status(201).json({
            message: 'Promo code created successfully',
            promo_id: result.insertId
        });
    } catch (error) {
        console.error('Error inserting promo code:', error);
        res.status(500).json({ message: 'Failed to create promo code' });
    }
});



app.get('/trips', async (req, res) => {
    const { status, from, to, date, busType } = req.query;
    try {
        let query = `
            SELECT trip.*, route.origin_name, route.destination_name, route.estimated_arrival_hours
            FROM trip
            INNER JOIN route ON trip.route_id = route.route_id
        `;
        let params = [];

        if (status) {
            query += ' WHERE trip.status = ?';
            params.push(status);
        }

        if (from || to) {
            query += status ? ' AND' : ' WHERE';
            if (from) {
                query += ' route.origin_name = ?';
                params.push(from);
            }
            if (to) {
                query += from ? ' AND' : '';
                query += ' route.destination_name = ?';
                params.push(to);
            }
        }

        if (date) {
            query += (status || from || to) ? ' AND' : ' WHERE';
            query += ' DATE(trip.depart_at) = ?';
            params.push(date);
        }

        if (busType) {
            query += (status || from || to || date) ? ' AND' : ' WHERE';
            query += ' trip.template_name = ?';
            params.push(busType);
        }

        console.log('Query:', query);
        console.log('Params:', params);

        const [trips] = await pool.promise().query(query, params);

        const tripsWithDetails = await Promise.all(trips.map(async (trip) => {
            const [routeStopsRows] = await pool.promise().query(
                'SELECT stop FROM route_stops WHERE route_id = ? ORDER BY sequence',
                [trip.route_id]
            );
            const routeStops = routeStopsRows.map(row => row.stop).join('-');

            const [tripSeatsRows] = await pool.promise().query(
                'SELECT seat_template_name FROM trip_seats WHERE trip_id = ?',
                [trip.trip_id]
            );
            const seatTemplateName = tripSeatsRows.length > 0 ? tripSeatsRows[0].seat_template_name : '';

            return {
                trip_id: trip.trip_id,
                price_per_seat: trip.price_per_seat,
                depart_at: trip.depart_at,
                arrive_at: trip.arrive_at,
                bus_license_number: trip.bus_license_number,
                status: trip.status,
                created_at: trip.created_at,
                updated_at: trip.updated_at,
                route_id: trip.route_id,
                origin_name: trip.origin_name,
                destination_name: trip.destination_name,
                distance_km: trip.distance_km,
                estimated_arrival_hours: trip.estimated_arrival_hours,
                routeStops: routeStops,
                template_name: seatTemplateName
            };
        }));

        res.send(tripsWithDetails);
    } catch (err) {
        console.error('Database error:', err);
        res.send({ message: 'Error retrieving trips' });
    }
});


app.get('/trips/:trip_id', async (req, res) => {
    const { trip_id } = req.params;
    try {
        const [tripRows] = await pool.promise().query('select * from trip where trip_id = ?', [trip_id]);
        if (tripRows.length === 0) {
            return res.send({ message: 'trip not found' });
        }
        const trip = tripRows[0];

        const [routeRows] = await pool.promise().query('select origin_name, destination_name, distance_km, estimated_arrival_hours from route where route_id = ?', [trip.route_id]);
        trip.routeDetails = routeRows.length > 0 ? routeRows[0] : {};

        const [tripSeatsRows] = await pool.promise().query('select trip_seat_id, status, seat_template_name from trip_seats where trip_id = ?', [trip_id]);
        trip.tripSeats = tripSeatsRows.map(seat => ({
            trip_seat_id: seat.trip_seat_id,
            status: seat.status
        }));

        if (tripSeatsRows.length > 0) {
            const seatTemplateName = tripSeatsRows[0].seat_template_name;
            const [seatTemplateRows] = await pool.promise().query('select seat_codes, total_seats, seats_per_row from seat_templates where template_name = ?', [seatTemplateName]);
            trip.seatTemplateDetails = seatTemplateRows.length > 0 ? seatTemplateRows[0] : {};
        }

        const [routeStopsRows] = await pool.promise().query('select stop from route_stops where route_id = ? order by sequence', [trip.route_id]);

        trip.routeStops = routeStopsRows.map(row => row.stop).join('-');

        res.send({
            trip_id: trip.trip_id,
            price_per_seat: trip.price_per_seat,
            depart_at: trip.depart_at,
            arrive_at: trip.arrive_at,
            bus_license_number: trip.bus_license_number,
            status: trip.status,
            created_at: trip.created_at,
            updated_at: trip.updated_at,
            template_name: tripSeatsRows[0].seat_template_name,
            route_id: trip.route_id,
            origin_name: trip.routeDetails.origin_name,
            destination_name: trip.routeDetails.destination_name,
            distance_km: trip.routeDetails.distance_km,
            estimated_arrival_hours: trip.routeDetails.estimated_arrival_hours,
            seatTemplateDetails: trip.seatTemplateDetails,
            tripSeats: trip.tripSeats,
            routeStops: trip.routeStops
        });
    } catch (err) {
        console.error('database error:', err);
        res.send({ message: 'error' });
    }
});

app.patch('/trips', async (req, res) => {
    const { trip_id } = req.query;
    const { price_per_seat, depart_at, arrive_at } = req.body;

    if (!trip_id) {
        return res.json({ error: 'trip_id is required' });
    }

    try {
        const [result] = await pool.promise().query(
            `UPDATE trip 
             SET price_per_seat = ?, depart_at = ?, arrive_at = ?, updated_at = CURRENT_TIMESTAMP
             WHERE trip_id = ?`,
            [price_per_seat, depart_at, arrive_at, trip_id]
        );

        if (result.affectedRows === 0) {
            return res.json({ message: 'Trip not found or no changes made' });
        }

        res.json({ message: 'Trip updated successfully', modifiedRows: result.affectedRows });
    } catch (err) {
        console.error('Database error:', err);
        res.json({ error: 'Failed to update trip' });
    }
});








//-------------------------

app.get('/', async (req, res) => {
    res.send('Mellow Server Running')
})

app.listen(port, () => {
    console.log('Mellow server is running on port: ', port)
})