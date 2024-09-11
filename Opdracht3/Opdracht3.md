# Opdracht 3 Cloud Technology & Security
**Qing Scholten (20208294)**

## Voorbereiding
1. De IOT Hub is succesvol aangemaakt.
![KwiksHub](img/image.png)

## Practicum opgave
1. De device is succesvol aangemaakt.
![NewDevice](img/image-1.png)
---
3. az iot hub monitor-events --output table -p all -n KwiksHub
   ![alt text](img/image-2.png)
   ![alt text](img/image-3.png)
   ![alt text](img/image-4.png)
   Het bericht is afkomstig van NewDevice. Dit is consistent.
   ![alt text](img/image-5.png)
---
4. De vier events zijn 'connect', 'error', 'disconnect' en 'message'. Deze vier hebben een handler in het NewDevice voorbeeld. In de vorige vraag is het 'connect' event gebruikt. 
---
5. 
![alt text](img/image-6.png)
   ![alt text](img/image-7.png)
   ![alt text](img/image-8.png)
---
6. 
![alt text](img/image-9.png)
   ![alt text](img/image-10.png)
   ![alt text](img/image-11.png)
   ![alt text](img/image-12.png)
---
7. ![alt text](img/image-13.png)
   ![alt text](img/image-14.png)
   ![alt text](img/image-15.png) 
---
9. De methodes "getDeviceLog" en "lockDoor".
---
10. 
![alt text](img/image-16.png)
    ![alt text](img/image-17.png)
---
11. 
![alt text](img/image-18.png)
    ![alt text](img/image-19.png)
---
12. 
![alt text](img/image-20.png)
    ![alt text](img/image-21.png)
---
13. 
![alt text](img/image-22.png)
![alt text](img/image-24.png)
![alt text](img/image-23.png)
![alt text](img/image-25.png)
![alt text](img/image-26.png)
---
14. 
![alt text](img/image-27.png)
![alt text](img/image-28.png)
![alt text](img/image-29.png)
![alt text](img/image-30.png)
---
16. De naam, de tags, connectiestatus, update tijd, laatste activiteit, authenticatietype, versie en laatste update.
---
17.  Het programma simuleert een termometer met een desired temperatuur ingesteld op 20 graden. Het programma stuurt een waarschuwing als het kouder wordt dan de desired temperatuur.
![alt text](img/image-33.png)
![alt text](img/image-32.png)
![alt text](img/image5.png)