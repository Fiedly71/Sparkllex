<?php
/**
 * Sparkllex Global Operations - PostgreSQL Processor
 * Handles Staff Signup for USA & Chile
 */

// 1. CONFIGURATION DE LA CONNEXION (À adapter selon tes accès Postgres)
$host = "localhost";
$port = "5432";
$dbname = "sparkllex_db"; // Remplace par le nom de ta base
$user = "postgres";       // Ton utilisateur PostgreSQL
$password = "ton_mot_de_passe"; // Ton mot de passe PostgreSQL

$connection_string = "host=$host port=$port dbname=$dbname user=$user password=$password";
$dbconn = pg_connect($connection_string);

if (!$dbconn) {
    die("Error: Could not connect to database. " . pg_last_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 2. CONFIGURATION DES DOSSIERS D'UPLOAD
    $target_dir = "uploads/";
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    // 3. RÉCUPÉRATION ET SÉCURISATION DES DONNÉES
    // pg_escape_string empêche les injections SQL
    $full_name = pg_escape_string($dbconn, $_POST['full_name']);
    $email     = pg_escape_string($dbconn, $_POST['email']);
    $phone     = pg_escape_string($dbconn, $_POST['phone']);
    $country   = pg_escape_string($dbconn, $_POST['country']);
    
    // Hachage sécurisé du mot de passe
    $password_hashed = password_hash($_POST['password'], PASSWORD_DEFAULT);

    // Logique spécifique par pays
    if ($country === 'USA') {
        $tax_id = pg_escape_string($dbconn, $_POST['ssn']);
        $location_details = pg_escape_string($dbconn, $_POST['usa_state']);
    } else {
        $tax_id = pg_escape_string($dbconn, $_POST['rut']);
        $location_details = pg_escape_string($dbconn, $_POST['afp'] . " / " . $_POST['salud']);
    }

    // 4. FONCTION POUR TRAITER LES FICHIERS
    function processUpload($file_key, $folder, $user_name) {
        if (!isset($_FILES[$file_key]) || $_FILES[$file_key]['error'] != 0) {
            return null;
        }

        $file_ext = strtolower(pathinfo($_FILES[$file_key]['name'], PATHINFO_EXTENSION));
        $allowed = ['pdf', 'jpg', 'jpeg', 'png'];

        if (in_array($file_ext, $allowed)) {
            // Nettoyage du nom de fichier
            $clean_name = str_replace(' ', '_', $user_name);
            $new_filename = $clean_name . "_" . time() . "_" . $file_key . "." . $file_ext;
            $destination = $folder . $new_filename;

            if (move_uploaded_file($_FILES[$file_key]['tmp_name'], $destination)) {
                return $destination;
            }
        }
        return null;
    }

    // Exécution des uploads
    $cv_path = processUpload('cv_file', $target_dir, $full_name);
    $id_path = processUpload('id_file', $target_dir, $full_name);

    // 5. INSERTION DANS LA TABLE POSTGRESQL
    $query = "INSERT INTO staff_members (
                full_name, email, password, phone, country, tax_id, location_details, cv_path, id_path
              ) VALUES (
                '$full_name', '$email', '$password_hashed', '$phone', '$country', '$tax_id', '$location_details', '$cv_path', '$id_path'
              )";

    $result = pg_query($dbconn, $query);

    if ($result) {
        // Succès : Redirection vers la page de confirmation
        header("Location: success-staff.html");
        exit();
    } else {
        echo "Error saving data: " . pg_last_error($dbconn);
    }

    // Fermeture de la connexion
    pg_close($dbconn);

} else {
    // Redirection si accès direct au fichier
    header("Location: staff-signup.html");
    exit();
}
?>