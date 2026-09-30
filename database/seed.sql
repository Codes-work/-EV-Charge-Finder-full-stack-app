INSERT INTO stations
    (name, address, latitude, longitude, price_per_kwh, num_bays, charge_type, status, hours, type)
VALUES

-- =========================================================
-- KOCHI / ERNAKULAM
-- =========================================================

('Kochi Infopark EV Hub',
 'Infopark Road, Kakkanad, Ernakulam, Kerala',
 10.0159, 76.3599, 18.50, 6, 'CCS', 'available', '24/7', 'ev_charging'),

('Kakkanad Tech Park Parking',
 'Seaport Airport Road, Kakkanad, Ernakulam, Kerala',
 10.0176, 76.3419, NULL, 120, NULL, 'available', '6 AM - 11 PM', 'parking'),

('Vyttila Mobility EV Station',
 'Vyttila Junction, Ernakulam, Kerala',
 9.9678, 76.3188, 17.75, 8, 'CCS', 'occupied', '24/7', 'ev_charging'),

('Marine Drive EV Point',
 'Shanmugham Road, Marine Drive, Ernakulam, Kerala',
 9.9816, 76.2766, 16.50, 4, 'Type 2', 'available', '24/7', 'ev_charging'),

('MG Road City Parking',
 'Mahatma Gandhi Road, Ernakulam, Kerala',
 9.9728, 76.2852, NULL, 80, NULL, 'available', '6 AM - 10 PM', 'parking'),

('Palarivattom EV Charge Point',
 'Palarivattom, Ernakulam, Kerala',
 10.0055, 76.3074, 18.00, 5, 'CCS', 'unknown', '24/7', 'ev_charging'),

('Kochi Airport Parking',
 'Nedumbassery, Kochi, Kerala',
 10.1520, 76.4019, NULL, 200, NULL, 'available', '24/7', 'parking'),

-- =========================================================
-- BENGALURU
-- =========================================================

('Electronic City Tech EV Station',
 'Electronic City Phase 1, Bengaluru, Karnataka',
 12.8399, 77.6770, 20.50, 10, 'CCS', 'available', '24/7', 'ev_charging'),

('Whitefield IT Park Charger',
 'Whitefield Main Road, Bengaluru, Karnataka',
 12.9698, 77.7499, 21.00, 8, 'CCS', 'occupied', '24/7', 'ev_charging'),

('Koramangala EV Hub',
 'Koramangala, Bengaluru, Karnataka',
 12.9352, 77.6245, 19.50, 6, 'Type 2', 'available', '6 AM - 11 PM', 'ev_charging'),

('Manyata Tech Park Parking',
 'Nagavara, Bengaluru, Karnataka',
 13.0453, 77.6200, NULL, 150, NULL, 'available', '24/7', 'parking'),

('Outer Ring Road EV Station',
 'Bellandur, Outer Ring Road, Bengaluru, Karnataka',
 12.9260, 77.6762, 22.00, 12, 'CCS', 'unknown', '24/7', 'ev_charging'),

('Indiranagar City Parking',
 'Indiranagar, Bengaluru, Karnataka',
 12.9719, 77.6412, NULL, 60, NULL, 'occupied', '7 AM - 11 PM', 'parking'),

-- =========================================================
-- HYDERABAD
-- =========================================================

('HITEC City EV Station',
 'HITEC City, Hyderabad, Telangana',
 17.4435, 78.3772, 19.00, 10, 'CCS', 'available', '24/7', 'ev_charging'),

('Gachibowli Tech Charger',
 'Gachibowli, Hyderabad, Telangana',
 17.4401, 78.3489, 18.50, 8, 'CCS', 'occupied', '24/7', 'ev_charging'),

('Financial District EV Hub',
 'Nanakramguda, Hyderabad, Telangana',
 17.4225, 78.3437, 21.00, 12, 'CCS', 'available', '24/7', 'ev_charging'),

('Madhapur Parking Plaza',
 'Madhapur, Hyderabad, Telangana',
 17.4483, 78.3915, NULL, 100, NULL, 'available', '6 AM - 11 PM', 'parking'),

('Kondapur EV Point',
 'Kondapur, Hyderabad, Telangana',
 17.4580, 78.3662, 19.75, 6, 'Type 2', 'unknown', '24/7', 'ev_charging'),

-- =========================================================
-- MUMBAI
-- =========================================================

('BKC Corporate EV Station',
 'Bandra Kurla Complex, Mumbai, Maharashtra',
 19.0596, 72.8656, 24.50, 10, 'CCS', 'available', '24/7', 'ev_charging'),

('Andheri Tech EV Hub',
 'Andheri East, Mumbai, Maharashtra',
 19.1197, 72.8647, 23.00, 8, 'CCS', 'occupied', '24/7', 'ev_charging'),

('Powai EV Charging Point',
 'Powai, Mumbai, Maharashtra',
 19.1176, 72.9060, 22.50, 6, 'Type 2', 'available', '6 AM - 11 PM', 'ev_charging'),

('Lower Parel Parking',
 'Lower Parel, Mumbai, Maharashtra',
 18.9988, 72.8258, NULL, 90, NULL, 'available', '6 AM - 12 AM', 'parking'),

('Airoli Business Park EV',
 'Airoli, Navi Mumbai, Maharashtra',
 19.1590, 72.9986, 21.50, 10, 'CCS', 'unknown', '24/7', 'ev_charging'),

-- =========================================================
-- PUNE
-- =========================================================

('Hinjewadi Tech Park EV',
 'Hinjewadi Phase 1, Pune, Maharashtra',
 18.5913, 73.7389, 19.50, 10, 'CCS', 'available', '24/7', 'ev_charging'),

('Kharadi IT Hub Charger',
 'Kharadi, Pune, Maharashtra',
 18.5514, 73.9477, 20.00, 8, 'CCS', 'occupied', '24/7', 'ev_charging'),

('Baner EV Station',
 'Baner Road, Pune, Maharashtra',
 18.5590, 73.7868, 18.75, 6, 'Type 2', 'available', '6 AM - 10 PM', 'ev_charging'),

('Magarpatta Parking',
 'Magarpatta City, Pune, Maharashtra',
 18.5133, 73.9270, NULL, 120, NULL, 'available', '24/7', 'parking'),

-- =========================================================
-- CHENNAI
-- =========================================================

('OMR Tech Corridor EV',
 'Old Mahabalipuram Road, Chennai, Tamil Nadu',
 12.9716, 80.2447, 18.50, 10, 'CCS', 'available', '24/7', 'ev_charging'),

('Sholinganallur EV Hub',
 'Sholinganallur, Chennai, Tamil Nadu',
 12.9010, 80.2279, 19.00, 8, 'CCS', 'occupied', '24/7', 'ev_charging'),

('Guindy Tech EV Station',
 'Guindy, Chennai, Tamil Nadu',
 13.0067, 80.2206, 20.00, 6, 'Type 2', 'available', '6 AM - 11 PM', 'ev_charging'),

('Tidel Park Parking',
 'Taramani, Chennai, Tamil Nadu',
 12.9889, 80.2487, NULL, 100, NULL, 'available', '24/7', 'parking'),

-- =========================================================
-- DELHI NCR / GURUGRAM / NOIDA
-- =========================================================

('Gurugram Cyber City EV',
 'Cyber City, Gurugram, Haryana',
 28.4949, 77.0895, 22.50, 10, 'CCS', 'available', '24/7', 'ev_charging'),

('Golf Course Road EV Hub',
 'Golf Course Road, Gurugram, Haryana',
 28.4595, 77.0969, 21.50, 8, 'CCS', 'occupied', '24/7', 'ev_charging'),

('Noida Sector 62 EV',
 'Sector 62, Noida, Uttar Pradesh',
 28.6270, 77.3649, 20.00, 8, 'CCS', 'available', '24/7', 'ev_charging'),

('Noida Tech Park Parking',
 'Sector 63, Noida, Uttar Pradesh',
 28.6257, 77.3810, NULL, 140, NULL, 'available', '6 AM - 11 PM', 'parking'),

('Connaught Place EV Station',
 'Connaught Place, New Delhi',
 28.6315, 77.2167, 23.00, 6, 'Type 2', 'unknown', '24/7', 'ev_charging'),

-- =========================================================
-- KOLKATA
-- =========================================================

('Salt Lake Sector V EV',
 'Sector V, Salt Lake, Kolkata, West Bengal',
 22.5726, 88.4330, 17.50, 8, 'CCS', 'available', '24/7', 'ev_charging'),

('New Town Tech Parking',
 'New Town, Kolkata, West Bengal',
 22.5794, 88.4580, NULL, 120, NULL, 'available', '6 AM - 11 PM', 'parking'),

-- =========================================================
-- AHMEDABAD
-- =========================================================

('GIFT City EV Station',
 'GIFT City, Gandhinagar, Gujarat',
 23.1610, 72.6770, 18.50, 10, 'CCS', 'available', '24/7', 'ev_charging'),

('SG Highway EV Hub',
 'SG Highway, Ahmedabad, Gujarat',
 23.0500, 72.5167, 19.00, 8, 'CCS', 'occupied', '24/7', 'ev_charging'),

-- =========================================================
-- COIMBATORE
-- =========================================================

('Coimbatore IT EV Station',
 'Saravanampatti, Coimbatore, Tamil Nadu',
 11.0795, 76.9966, 17.00, 6, 'CCS', 'available', '24/7', 'ev_charging'),

('Avinashi Road Parking',
 'Avinashi Road, Coimbatore, Tamil Nadu',
 11.0168, 76.9558, NULL, 80, NULL, 'available', '6 AM - 10 PM', 'parking'),

-- =========================================================
-- THIRUVANANTHAPURAM
-- =========================================================

('Technopark EV Station',
 'Technopark Campus, Thiruvananthapuram, Kerala',
 8.5569, 76.8816, 16.50, 8, 'CCS', 'available', '24/7', 'ev_charging'),

('Kazhakkoottam Parking',
 'Kazhakkoottam, Thiruvananthapuram, Kerala',
 8.5680, 76.8735, NULL, 100, NULL, 'available', '6 AM - 11 PM', 'parking');