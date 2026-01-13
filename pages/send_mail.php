<?php
// Nur POST-Anfragen erlauben
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Daten lesen
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    // Eingaben bereinigen
    $name = htmlspecialchars(strip_tags($data->name));
    $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
    $dept = htmlspecialchars(strip_tags($data->dept));
    $message = htmlspecialchars(strip_tags($data->message));

    // Empfänger-Logik
    $emailMap = [
        'general' => 'kontakt@team-lazer.de',
        'support' => 'support@team-lazer.de',
        'security' => 'security@team-lazer.de',
        'partnership' => 'kontakt@team-lazer.de'
    ];

    // Ziel-Adresse
    $to = isset($emailMap[$dept]) ? $emailMap[$dept] : 'kontakt@team-lazer.de';

    $subject = "Neue Anfrage von $name ($dept)";

    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Bereich: $dept\n\n";
    $email_content .= "Nachricht:\n$message\n";

    // WICHTIG: Hier muss die existierende Strato-Adresse rein!
    $senderAddress = 'service@team-lazer.de';

    $headers = "From: $senderAddress\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // HIER IST DER FIX: Der 5. Parameter "-f..."
    if (mail($to, $subject, $email_content, $headers, "-f" . $senderAddress)) {
        http_response_code(200);
        echo "Erfolg";
    } else {
        http_response_code(500);
        echo "Fehler beim Senden";
    }

} else {
    http_response_code(403);
    echo "Zugriff verweigert";
}
?>