<?php
// Fehler anzeigen, damit wir sehen was passiert
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>Strato Mail Diagnose</h1>";

// --- EINSTELLUNGEN ---
// HIER DEINE ECHTE STRATO-ADRESSE EINTRAGEN (Die existieren muss!):
$absender = 'service@team-lazer.de'; 

// HIER DEINE PRIVATE EMAIL (z.B. Gmail) ZUM TESTEN:
$empfaenger = 'jonwagner2007@gmail.com@gmail.com'; 
// ---------------------

$betreff = "Test-Mail von PHP Script";
$nachricht = "Wenn du das hier liest, funktioniert der Mailversand technisch!";

// Header bauen
$headers = "From: " . $absender . "\r\n" .
           "Reply-To: " . $absender . "\r\n" .
           "X-Mailer: PHP/" . phpversion();

echo "Versuche Mail zu senden von <b>$absender</b> an <b>$empfaenger</b>...<br><br>";

// Versuch 1: Standard
if(mail($empfaenger, $betreff, $nachricht, $headers)) {
    echo "<b style='color:green'>ERFOLG (Versuch 1)!</b> Die Mail wurde ohne Parameter akzeptiert.<br>";
} else {
    echo "<b style='color:red'>FEHLER (Versuch 1).</b> Standard-Versand abgelehnt.<br>";
    
    // Versuch 2: Mit -f Parameter (Erzwingen)
    echo "<br>Starte Versuch 2 (mit -f Parameter)...<br>";
    if(mail($empfaenger, $betreff, $nachricht, $headers, "-f" . $absender)) {
        echo "<b style='color:green'>ERFOLG (Versuch 2)!</b> Mit -f Parameter hat es geklappt.<br>";
    } else {
        echo "<b style='color:red'>FEHLER (Versuch 2).</b> Auch mit -f abgelehnt.<br>";
        echo "Mögliche Gründe: <br>";
        echo "1. Die Absender-Adresse '$absender' existiert nicht exakt so im Strato-Panel.<br>";
        echo "2. Der Server hat eine Spam-Sperre (zu viele Versuche).<br>";
        echo "3. PHP mail() ist in diesem Paket deaktiviert.<br>";
    }
}
?>