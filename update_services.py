import re

with open('services.html', 'r') as f:
    content = f.read()

# Replace Tour Packages image (Dal Lake -> Pahalgam)
content = re.sub(r'<img src="https://unsplash\.com/photos/o7SpmTcZ3jI/download\?force=true&w=900&h=675&fit=crop" alt="Dal Lake houseboats and shikaras for Kashmir tour package service"',
                 r'<img src="assets/images/pahalgam.png" alt="Tour Packages in Kashmir"', content)

# Replace Private Cab Service image
content = re.sub(r'<img src="https://unsplash\.com/photos/sgcIbeUByU4/download\?force=true&w=900&h=675&fit=crop" alt="Mountain road through green valley for Kashmir private cab service"',
                 r'<img src="assets/images/service-cab.png" alt="Private Cab Service in Kashmir"', content)

# Replace Houseboat Booking image
content = re.sub(r'<img src="https://unsplash\.com/photos/o7SpmTcZ3jI/download\?force=true&w=900&h=675&fit=crop" alt="Houseboat booking service on Dal Lake in Srinagar"',
                 r'<img src="assets/images/service-houseboat.png" alt="Premium Houseboat Booking on Dal Lake"', content)

# Replace Hotel Booking image
content = re.sub(r'<img src="https://unsplash\.com/photos/5G5TKIemoWI/download\?force=true&w=900&h=675&fit=crop" alt="Hotel booking service for Kashmir valley stays in Pahalgam"',
                 r'<img src="assets/images/service-hotel.png" alt="Luxury Hotel Booking in Kashmir"', content)

# Replace Shikara Rides image
content = re.sub(r'<img src="https://unsplash\.com/photos/MBsLiGLwIPs/download\?force=true&w=900&h=675&fit=crop" alt="Shikara ride service on Dal Lake in Srinagar"',
                 r'<img src="assets/images/service-shikara.png" alt="Romantic Shikara Rides on Dal Lake"', content)

# Replace Adventure Activities image
content = re.sub(r'<img src="https://unsplash\.com/photos/6AY2L4JzOOc/download\?force=true&w=900&h=675&fit=crop" alt="Adventure activity service with Gulmarg gondola and snow slope"',
                 r'<img src="assets/images/service-adventure.png" alt="Adventure Activities in Gulmarg"', content)

# Replace Amarnath Yatra image
content = re.sub(r'<img src="https://unsplash\.com/photos/Iq8Aqgf9f_Y/download\?force=true&w=900&h=675&fit=crop" alt="Amarnath Yatra pilgrimage travel planning across Kashmir mountain route"',
                 r'<img src="assets/images/amarnath.png" alt="Amarnath Yatra Pilgrimage Package"', content)

# Replace Vaishno Devi Packages image
content = re.sub(r'<img src="https://unsplash\.com/photos/TMJxZ_-xB-A/download\?force=true&w=900&h=675&fit=crop" alt="Vaishno Devi package and transfer planning service with mountain valley route"',
                 r'<img src="assets/images/vaishno-devi.png" alt="Vaishno Devi Tour Packages"', content)

with open('services.html', 'w') as f:
    f.write(content)

