-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Photography Job Planner: database structure with FICTIONAL demo data.
-- Every name, phone number and email below is made up.
-- Demo login: username 'demo', password 'demo'
--
-- Load it into an empty database, e.g.:
--   mysql -u root -p photography_job_planner < DB_Structure_data_demo.sql
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `password`, `email`) VALUES
(1, 'demo', 'demo', 'demo@example.com');

-- --------------------------------------------------------

--
-- Table structure for table `Associates`
--

DROP TABLE IF EXISTS `Associates`;
CREATE TABLE `Associates` (
  `id` int(11) NOT NULL,
  `associate_type` varchar(45) DEFAULT NULL,
  `firstname` varchar(45) DEFAULT NULL,
  `surname` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Associates`
--

INSERT INTO `Associates` (`id`, `associate_type`, `firstname`, `surname`, `email`, `phone`) VALUES
(1, 'Φωτογράφος', 'Νίκος', 'Παπαδάκης', 'n.papadakis@example.com', '6900000001'),
(2, 'Φωτογράφος', 'Ελένη', 'Γεωργίου', 'e.georgiou@example.com', '6900000002'),
(3, 'Βιντεογράφος', 'Στέλιος', 'Καραγιάννης', 's.karagiannis@example.com', '6900000003'),
(4, 'Βιντεογράφος', 'Κατερίνα', 'Βλάχου', 'k.vlachou@example.com', '6900000004'),
(5, 'Μοντάζ', 'Μαρία', 'Δημητρίου', 'm.dimitriou@example.com', '6900000005'),
(6, 'Άλμπουμ', 'Γιώργος', 'Λαμπρόπουλος', 'albums@example.com', '6900000006'),
(7, 'Drone', 'Πέτρος', 'Αντωνίου', 'p.antoniou@example.com', '6900000007'),
(8, 'Λογιστής', 'Σοφία', 'Αναστασίου', 'accounting@example.com', '6900000008');

-- --------------------------------------------------------

--
-- Table structure for table `CustomerPayments`
--

DROP TABLE IF EXISTS `CustomerPayments`;
CREATE TABLE `CustomerPayments` (
  `id` int(11) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `date` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `job_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `CustomerPayments`
--

INSERT INTO `CustomerPayments` (`id`, `amount`, `date`, `job_id`) VALUES
(1, 600, '2025-03-01 18:00:00', 1),
(2, 1000, '2025-06-14 23:00:00', 1),
(3, 600, '2025-05-18 15:00:00', 2),
(4, 900, '2025-09-06 23:00:00', 3),
(5, 1000, '2025-10-20 19:00:00', 3),
(6, 650, '2025-10-12 15:00:00', 4),
(7, 700, '2026-01-15 18:00:00', 5),
(8, 1050, '2026-05-30 23:30:00', 5),
(9, 250, '2026-04-19 13:00:00', 6),
(10, 500, '2026-02-10 18:20:00', 7),
(11, 800, '2026-06-20 23:30:00', 7),
(12, 400, '2026-04-02 17:45:00', 8),
(13, 300, '2026-09-12 22:10:00', 8),
(14, 200, '2026-08-15 12:00:00', 9),
(15, 500, '2026-05-11 19:05:00', 10),
(16, 150, '2026-09-30 11:40:00', 11),
(17, 400, '2026-10-01 18:00:00', 13);

-- --------------------------------------------------------

--
-- Table structure for table `JobArchive`
--

DROP TABLE IF EXISTS `JobArchive`;
CREATE TABLE `JobArchive` (
  `id` int(11) NOT NULL,
  `job_name` varchar(45) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `name1` varchar(45) DEFAULT NULL,
  `name2` varchar(45) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `church` varchar(45) DEFAULT NULL,
  `offer_package` varchar(150) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `video_editor` int(11) DEFAULT NULL,
  `album_printer` int(11) DEFAULT NULL,
  `photographer1` int(11) DEFAULT NULL,
  `photographer2` int(11) DEFAULT NULL,
  `videographer1` int(11) DEFAULT NULL,
  `videographer2` int(11) DEFAULT NULL,
  `drone` int(11) DEFAULT NULL,
  `sent_to_editor` date DEFAULT NULL,
  `recieved_from_editor` date DEFAULT NULL,
  `sent_to_printer` date DEFAULT NULL,
  `recieved_from_printer` date DEFAULT NULL,
  `ph1_payment` int(11) DEFAULT NULL,
  `ph2_payment` int(11) DEFAULT NULL,
  `vid1_payment` int(11) DEFAULT NULL,
  `vid2_payment` int(11) DEFAULT NULL,
  `drone_payment` int(11) DEFAULT NULL,
  `editor_payment` int(11) DEFAULT NULL,
  `printer_payment` int(11) DEFAULT NULL,
  `job_type` varchar(20) DEFAULT NULL,
  `EventLocation` varchar(45) DEFAULT NULL,
  `groom_place` varchar(45) DEFAULT NULL,
  `groom_time` time DEFAULT NULL,
  `bride_time` time DEFAULT NULL,
  `bride_place` varchar(45) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `pdf` varchar(100) NOT NULL DEFAULT '',
  `ph1_pay_done` tinyint(1) NOT NULL,
  `ph2_pay_done` tinyint(1) NOT NULL,
  `vid1_pay_done` tinyint(1) NOT NULL,
  `vid2_pay_done` tinyint(1) NOT NULL,
  `editor_pay_done` tinyint(1) NOT NULL,
  `drone_pay_done` tinyint(1) NOT NULL,
  `printer_pay_done` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `JobArchive`
--

INSERT INTO `JobArchive` (`id`, `job_name`, `date`, `name1`, `name2`, `description`, `church`, `offer_package`, `price`, `video_editor`, `album_printer`, `photographer1`, `photographer2`, `videographer1`, `videographer2`, `drone`, `sent_to_editor`, `recieved_from_editor`, `sent_to_printer`, `recieved_from_printer`, `ph1_payment`, `ph2_payment`, `vid1_payment`, `vid2_payment`, `drone_payment`, `editor_payment`, `printer_payment`, `job_type`, `EventLocation`, `groom_place`, `groom_time`, `bride_time`, `bride_place`, `phone`, `pdf`, `ph1_pay_done`, `ph2_pay_done`, `vid1_pay_done`, `vid2_pay_done`, `drone_pay_done`, `editor_pay_done`, `printer_pay_done`) VALUES
(1, 'Παναγιώτης Ελένη', '2025-06-14 19:00:00', 'Παναγιώτης Αθανασίου', 'Ελένη Βασιλείου', 'Γάμος με 180 καλεσμένους', 'Άγιος Δημήτριος', '1,2,2,4-1,3', 1600, 5, 6, 1, 2, 3, 4, 7, '2025-06-20', '2025-07-10', '2025-07-12', '2025-07-28', 150, 120, 100, 80, 60, 150, 120, 'gamos', 'Κτήμα Ελιά', 'Καλαμαριά', '17:30:00', '18:00:00', 'Πυλαία', '6900000201', '', 1, 1, 1, 1, 1, 1, 1),
(2, 'Ανδρέας Βασιλική', '2025-05-18 13:00:00', 'Ανδρέας Χατζής', 'Βασιλική Χατζή', 'Βάπτιση γιου', 'Αγία Σοφία', '1,1,1,5', 600, 5, 6, 1, NULL, 3, NULL, NULL, '2025-05-22', '2025-06-05', '2025-06-06', '2025-06-18', 120, 0, 80, 0, 0, 100, 60, 'baptisi', 'Ταβέρνα Ο Μύλος', '', '00:00:00', '00:00:00', '', '6900000202', '', 1, 0, 1, 0, 0, 1, 1),
(3, 'Δημήτρης Αικατερίνη', '2025-09-06 18:30:00', 'Δημήτρης Καλογήρου', 'Αικατερίνη Σιδηροπούλου', '', 'Άγιος Γεώργιος', '2,2,1,4-1,3', 1900, 5, 6, 1, 2, 3, 4, 7, '2025-09-12', '2025-10-01', '2025-10-03', '2025-10-20', 150, 120, 100, 80, 60, 150, 120, 'gamos', 'Αίθουσα Αστέρια', 'Θέρμη', '17:00:00', '17:30:00', 'Περαία', '6900000203', '', 1, 1, 1, 1, 1, 1, 1),
(4, 'Ηλίας Μαρίνα', '2025-10-12 12:30:00', 'Ηλίας Πετρίδης', 'Μαρίνα Πετρίδου', '', 'Παναγία Φανερωμένη', '1,1', 650, 5, 6, 1, NULL, 3, NULL, NULL, '2025-10-15', '2025-10-30', '2025-11-01', '2025-11-12', 120, 0, 80, 0, 0, 100, 60, 'baptisi', 'Εστιατόριο Θέα', '', '00:00:00', '00:00:00', '', '6900000204', '', 1, 0, 1, 0, 0, 1, 1),
(5, 'Βασίλης Ζωή', '2026-05-30 19:00:00', 'Βασίλης Γκούμας', 'Ζωή Τσολάκη', 'Ζήτησαν video highlights 3 λεπτών', 'Αγία Τριάδα', '1,2,2,3,1,5', 1750, 5, 6, 1, 2, 3, 4, 7, '2026-06-05', '2026-06-25', '2026-06-27', '2026-07-10', 150, 120, 100, 80, 60, 150, 120, 'gamos', 'Κτήμα Πλάτανος', 'Νεάπολη', '17:30:00', '18:00:00', 'Εύοσμος', '6900000205', '', 1, 1, 1, 1, 1, 1, 1),
(6, 'Χρήστος Ιωαννίδης', '2026-04-19 11:00:00', 'Χρήστος Ιωαννίδης', '', 'Φωτογράφιση οικογένειας', '', '', 250, 5, NULL, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 80, 0, 0, 0, 0, 40, 0, 'fotografisi', 'Παραλία Θεσσαλονίκης', '', '00:00:00', '00:00:00', '', '6900000206', '', 1, 0, 0, 0, 0, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Jobs`
--

DROP TABLE IF EXISTS `Jobs`;
CREATE TABLE `Jobs` (
  `id` int(11) NOT NULL,
  `job_name` varchar(45) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `name1` varchar(45) DEFAULT NULL,
  `name2` varchar(45) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `church` varchar(45) DEFAULT NULL,
  `offer_package` varchar(150) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `task1` int(11) DEFAULT NULL,
  `task2` int(11) DEFAULT NULL,
  `task3` int(11) DEFAULT NULL,
  `task4` int(11) DEFAULT NULL,
  `task5` int(11) DEFAULT NULL,
  `task6` int(11) DEFAULT NULL,
  `task7` int(11) DEFAULT NULL,
  `task8` int(11) DEFAULT NULL,
  `task9` int(11) DEFAULT NULL,
  `task10` int(11) DEFAULT NULL,
  `task11` int(11) DEFAULT NULL,
  `video_editor` int(11) DEFAULT NULL,
  `album_printer` int(11) DEFAULT NULL,
  `photographer1` int(11) DEFAULT NULL,
  `photographer2` int(11) DEFAULT NULL,
  `videographer1` int(11) DEFAULT NULL,
  `videographer2` int(11) DEFAULT NULL,
  `drone` int(11) DEFAULT NULL,
  `sent_to_editor` date DEFAULT NULL,
  `recieved_from_editor` date DEFAULT NULL,
  `sent_to_printer` date DEFAULT NULL,
  `recieved_from_printer` date DEFAULT NULL,
  `ph1_payment` int(11) DEFAULT 0,
  `ph2_payment` int(11) DEFAULT 0,
  `vid1_payment` int(11) DEFAULT 0,
  `vid2_payment` int(11) DEFAULT 0,
  `drone_payment` int(11) DEFAULT 0,
  `editor_payment` int(11) DEFAULT 0,
  `printer_payment` int(11) DEFAULT 0,
  `job_type` varchar(20) DEFAULT NULL,
  `EventLocation` varchar(45) DEFAULT NULL,
  `groom_place` varchar(45) DEFAULT NULL,
  `groom_time` time DEFAULT NULL,
  `bride_time` time DEFAULT NULL,
  `bride_place` varchar(45) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `pdf` varchar(100) NOT NULL DEFAULT '',
  `ph1_pay_done` tinyint(1) NOT NULL,
  `ph2_pay_done` tinyint(1) NOT NULL,
  `vid1_pay_done` tinyint(1) NOT NULL,
  `vid2_pay_done` tinyint(1) NOT NULL,
  `editor_pay_done` tinyint(1) NOT NULL,
  `drone_pay_done` tinyint(1) NOT NULL,
  `printer_pay_done` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Jobs`
--

INSERT INTO `Jobs` (`id`, `job_name`, `date`, `name1`, `name2`, `description`, `church`, `offer_package`, `price`, `task1`, `task2`, `task3`, `task4`, `task5`, `task6`, `task7`, `task8`, `task9`, `task10`, `task11`, `video_editor`, `album_printer`, `photographer1`, `photographer2`, `videographer1`, `videographer2`, `drone`, `sent_to_editor`, `recieved_from_editor`, `sent_to_printer`, `recieved_from_printer`, `ph1_payment`, `ph2_payment`, `vid1_payment`, `vid2_payment`, `drone_payment`, `editor_payment`, `printer_payment`, `job_type`, `EventLocation`, `groom_place`, `groom_time`, `bride_time`, `bride_place`, `phone`, `pdf`, `ph1_pay_done`, `ph2_pay_done`, `vid1_pay_done`, `vid2_pay_done`, `drone_pay_done`, `editor_pay_done`, `printer_pay_done`) VALUES
(7, 'Αλέξανδρος Σοφία', '2026-06-20 19:00:00', 'Αλέξανδρος Νικολάου', 'Σοφία Παππά', 'Ζητήθηκε επιπλέον άλμπουμ γονέων', 'Άγιος Δημήτριος', '1,2,2,3-1,5', 1800, 1, 1, 1, 1, 1, 1, 1, 1, 1, NULL, NULL, 5, 6, 1, 2, 3, 4, 7, '2026-07-01', '2026-07-20', '2026-07-25', NULL, 150, 120, 100, 80, 60, 150, 120, 'gamos', 'Κτήμα Ελιά', 'Καλαμαριά', '17:30:00', '18:00:00', 'Πυλαία', '6900000101', '', 1, 1, 1, 1, 1, 0, 0),
(8, 'Γιάννης Χριστίνα', '2026-09-12 18:30:00', 'Γιάννης Οικονόμου', 'Χριστίνα Μαυρίδου', '', 'Αγία Σοφία', '1,1,1,4', 1500, 1, 1, 1, 1, 1, 1, NULL, NULL, NULL, NULL, NULL, 5, 6, 1, 2, 3, 4, 7, '2026-09-20', NULL, NULL, NULL, 150, 120, 100, 80, 60, 150, 120, 'gamos', 'Αίθουσα Αστέρια', 'Νεάπολη', '17:00:00', '17:30:00', 'Εύοσμος', '6900000102', '', 1, 1, 0, 0, 0, 0, 0),
(9, 'Μιχάλης Ευαγγελία', '2026-10-03 13:00:00', 'Μιχάλης Τσακίρης', 'Ευαγγελία Ράπτη', 'Βάπτιση κόρης', 'Άγιος Νικόλαος', '1,1', 650, 1, 1, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, 6, 1, NULL, 3, NULL, NULL, NULL, NULL, NULL, NULL, 120, 0, 80, 0, 0, 100, 60, 'baptisi', 'Ταβέρνα Το Λιμανάκι', '', '00:00:00', '00:00:00', '', '6900000103', '', 1, 0, 0, 0, 0, 0, 0),
(10, 'Κωνσταντίνος Δέσποινα', '2026-10-24 19:00:00', 'Κωνσταντίνος Ζαχαρίου', 'Δέσποινα Αλεξίου', '', 'Άγιος Γεώργιος', '2,2,1,3-1,5', 2000, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, 6, 1, 2, 3, 4, 7, NULL, NULL, NULL, NULL, 150, 120, 100, 80, 60, 150, 120, 'gamos', 'Κτήμα Πλάτανος', 'Θέρμη', '17:30:00', '18:00:00', 'Περαία', '6900000104', '', 0, 0, 0, 0, 0, 0, 0),
(11, 'Θοδωρής Αναστασία', '2026-11-08 12:30:00', 'Θοδωρής Μπέκας', 'Αναστασία Μπέκα', '', 'Παναγία Φανερωμένη', '1,1', 600, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, 6, 1, NULL, 3, NULL, NULL, NULL, NULL, NULL, NULL, 120, 0, 80, 0, 0, 100, 60, 'baptisi', 'Εστιατόριο Θέα', '', '00:00:00', '00:00:00', '', '6900000105', '', 0, 0, 0, 0, 0, 0, 0),
(12, 'Σταύρος Μελίνα', '2026-11-21 11:00:00', 'Σταύρος Λιάκος', 'Μελίνα Λιάκου', 'Φωτογράφιση οικογένειας', '', '', 250, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 80, 0, 0, 0, 0, 40, 0, 'fotografisi', 'Πάρκο Νέας Παραλίας', '', '00:00:00', '00:00:00', '', '6900000107', '', 0, 0, 0, 0, 0, 0, 0),
(13, 'Νικόλαος Ιωάννα', '2027-05-15 19:30:00', 'Νικόλαος Σταυρίδης', 'Ιωάννα Κυριακίδου', 'Θέλουν και pre-wedding φωτογράφιση', 'Αγία Τριάδα', '1,2,1,4', 1700, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, 6, 1, 2, 3, 4, 7, NULL, NULL, NULL, NULL, 150, 120, 100, 80, 60, 150, 120, 'gamos', 'Αίθουσα Λευκός Πύργος', 'Καλαμαριά', '18:00:00', '18:30:00', 'Πανόραμα', '6900000106', '', 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Offers`
--

DROP TABLE IF EXISTS `Offers`;
CREATE TABLE `Offers` (
  `id` int(11) NOT NULL,
  `offer_name` varchar(45) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `name1` varchar(45) DEFAULT NULL,
  `name2` varchar(45) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `church` varchar(45) DEFAULT NULL,
  `offer_package` varchar(150) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `offer_type` varchar(20) DEFAULT NULL,
  `EventLocation` varchar(45) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `pdf` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Offers`
--

INSERT INTO `Offers` (`id`, `offer_name`, `date`, `name1`, `name2`, `description`, `church`, `offer_package`, `price`, `offer_type`, `EventLocation`, `phone`, `pdf`) VALUES
(1, 'Λευτέρης Αθηνά', '2027-06-12 19:00:00', 'Λευτέρης Δούκας', 'Αθηνά Ρήγα', 'Ενδιαφέρονται για drone', 'Άγιος Δημήτριος', '1,2,1,3', 1800, 'gamos', 'Κτήμα Ελιά', '6900000301', ''),
(2, 'Πάνος Ρένα', '2026-12-06 13:00:00', 'Πάνος Σαββίδης', 'Ρένα Σαββίδου', '', 'Αγία Σοφία', '1,1', 600, 'baptisi', 'Εστιατόριο Θέα', '6900000302', ''),
(3, 'Άρης Νεφέλη', '2027-07-03 19:30:00', 'Άρης Κουτσός', 'Νεφέλη Μάνου', 'Θα επιβεβαιώσουν μέχρι τον Ιανουάριο', 'Αγία Τριάδα', '2,2,1,4-1,3', 2100, 'gamos', 'Αίθουσα Αστέρια', '6900000303', ''),
(4, 'Ευτυχία Λάμπρου', '2026-12-20 11:00:00', 'Ευτυχία Λάμπρου', '', 'Χριστουγεννιάτικη φωτογράφιση', '', '', 200, 'fotografisi', 'Στούντιο', '6900000304', '');

-- --------------------------------------------------------

--
-- Table structure for table `OffersArchive`
--

DROP TABLE IF EXISTS `OffersArchive`;
CREATE TABLE `OffersArchive` (
  `id` int(11) NOT NULL,
  `offer_name` varchar(45) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `name1` varchar(45) DEFAULT NULL,
  `name2` varchar(45) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `church` varchar(45) DEFAULT NULL,
  `offer_package` varchar(150) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `offer_type` varchar(20) DEFAULT NULL,
  `EventLocation` varchar(45) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `pdf` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `OffersArchive`
--

INSERT INTO `OffersArchive` (`id`, `offer_name`, `date`, `name1`, `name2`, `description`, `church`, `offer_package`, `price`, `offer_type`, `EventLocation`, `phone`, `pdf`) VALUES
(1, 'Τάσος Γεωργία', '2026-05-09 19:00:00', 'Τάσος Μελάς', 'Γεωργία Πέτρου', 'Επέλεξαν άλλο φωτογράφο', 'Άγιος Γεώργιος', '1,2,1,3', 1650, 'gamos', 'Κτήμα Πλάτανος', '6900000401', ''),
(2, 'Ορέστης Ηρώ', '2026-03-22 13:00:00', 'Ορέστης Βλάχος', 'Ηρώ Βλάχου', 'Αναβολή της βάπτισης', 'Παναγία Φανερωμένη', '1,1', 550, 'baptisi', 'Ταβέρνα Ο Μύλος', '6900000402', '');

-- --------------------------------------------------------

--
-- Table structure for table `Products`
--

DROP TABLE IF EXISTS `Products`;
CREATE TABLE `Products` (
  `id` int(11) NOT NULL,
  `product_name` varchar(45) DEFAULT NULL,
  `price` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `Products`
--

INSERT INTO `Products` (`id`, `product_name`, `price`) VALUES
(1, 'Άλμπουμ 15x20', 5.5),
(2, 'Άλμπουμ 15x30', 6),
(3, 'Κορνίζα 15x15', 10),
(4, 'Άλμπουμ γονέων 20x30', 12),
(5, 'USB με φωτογραφίες', 8);

--
-- Indexes for dumped tables (primary keys are declared in CREATE TABLE)
--

--
-- Indexes for table `JobArchive`
--
ALTER TABLE `JobArchive`
  ADD KEY `photographer1_idx` (`photographer1`),
  ADD KEY `photographer2_idx` (`photographer2`),
  ADD KEY `videographer1_idx` (`videographer1`),
  ADD KEY `videographer2_idx` (`videographer2`),
  ADD KEY `drone_idx` (`drone`),
  ADD KEY `album_printer_idx` (`album_printer`),
  ADD KEY `video_editor_idx` (`video_editor`);

--
-- Indexes for table `Jobs`
--
ALTER TABLE `Jobs`
  ADD UNIQUE KEY `id_UNIQUE` (`id`),
  ADD KEY `photographer1_idx` (`photographer1`),
  ADD KEY `photographer2_idx` (`photographer2`),
  ADD KEY `videographer1_idx` (`videographer1`),
  ADD KEY `videographer2_idx` (`videographer2`),
  ADD KEY `drone_idx` (`drone`),
  ADD KEY `album_printer_idx` (`album_printer`),
  ADD KEY `video_editor_idx` (`video_editor`);

--
-- Indexes for table `Products`
--
ALTER TABLE `Products`
  ADD UNIQUE KEY `id_UNIQUE` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Associates`
--
ALTER TABLE `Associates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `CustomerPayments`
--
ALTER TABLE `CustomerPayments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `Jobs`
--
ALTER TABLE `Jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `Offers`
--
ALTER TABLE `Offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `OffersArchive`
--
ALTER TABLE `OffersArchive`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `JobArchive`
--
ALTER TABLE `JobArchive`
  ADD CONSTRAINT `arch_album_printer` FOREIGN KEY (`album_printer`) REFERENCES `Associates` (`id`),
  ADD CONSTRAINT `arch_drone` FOREIGN KEY (`drone`) REFERENCES `Associates` (`id`),
  ADD CONSTRAINT `arch_photographer1` FOREIGN KEY (`photographer1`) REFERENCES `Associates` (`id`),
  ADD CONSTRAINT `arch_photographer2` FOREIGN KEY (`photographer2`) REFERENCES `Associates` (`id`),
  ADD CONSTRAINT `arch_video_editor` FOREIGN KEY (`video_editor`) REFERENCES `Associates` (`id`),
  ADD CONSTRAINT `arch_videographer1` FOREIGN KEY (`videographer1`) REFERENCES `Associates` (`id`),
  ADD CONSTRAINT `arch_videographer2` FOREIGN KEY (`videographer2`) REFERENCES `Associates` (`id`);

--
-- Constraints for table `Jobs`
--
ALTER TABLE `Jobs`
  ADD CONSTRAINT `album_printer` FOREIGN KEY (`album_printer`) REFERENCES `Associates` (`id`),
  ADD CONSTRAINT `drone` FOREIGN KEY (`drone`) REFERENCES `Associates` (`id`),
  ADD CONSTRAINT `photographer1` FOREIGN KEY (`photographer1`) REFERENCES `Associates` (`id`),
  ADD CONSTRAINT `photographer2` FOREIGN KEY (`photographer2`) REFERENCES `Associates` (`id`),
  ADD CONSTRAINT `video_editor` FOREIGN KEY (`video_editor`) REFERENCES `Associates` (`id`),
  ADD CONSTRAINT `videographer1` FOREIGN KEY (`videographer1`) REFERENCES `Associates` (`id`),
  ADD CONSTRAINT `videographer2` FOREIGN KEY (`videographer2`) REFERENCES `Associates` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
