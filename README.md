# Müzik oylama
## Kullanılan framework, araçlar
- NodeJS: İstemci isteklerini işleyebilmek için kullanılan framework
- NPM: Projede kullanılan kütüphaneleri yönetmek için kullanılan package manager (nodejs yüklendiğinde otomatik olarak yüklenmiş olur).
- PM2: Uygulamanın arkaplanda sürekli çalışmasını sağlamak için kullanılan kütüphane.
- MySQL yada SQLite (MySQL kullanılması tavsiye edilir)

## Araçların bilgisayara yüklenmesi
- NodeJS'yi bilgisayarınıza https://nodejs.org/en/download/package-manager/ bu sayfada belirtildiği gibi yükleyin.
- PM2 kütüphanesini bilgisayara yüklemek için `npm install pm2 -g` komutunu komut satırında çalıştırın.
- MySQL
  - MySQL içerisinde `music_election` adında bir boş bir veritabanı oluşturun.
  - `src/lib/DBManager.js` dosyasında belirtilen MySQL kullanıcı adı ve şifrelerini düzenleyin.
- SQLite
  - SQLite kullanılacak ise  `src/lib/DBManager.js` dosyasındaki `dialect` alanı `sqlite` olarak belirtilmelidir, kullanıcı adı yada şifreye gerek yok.


## Proje kurulumu
- Komut satırından projeyi klonlamak istediğiniz klasöre girin örneğin: `cd c:\projeler\`
- Projeyi bulunduğunuz klasöre klonlamak için şu komutu çalıştırın: `git clone https://github.com/socket-programming/music-election.git`
- Proje klasörüne girin `cd music-election` 
- Projede kullanılan kütüphaneleri yüklemek için şu komutu çalıştırın: `npm install` (eğer sunucuya kurulum yapılacak ise `npm install --production`)
- Projeyi çalıştırmak için şu komutu çalıştırın: `npm run pm2` eğer geliştirme amaçlı olarak projeyi çalıştıracak iseniz `npm run dev` komutunu çalıştırın.
- Bilgisayarınızdaki herhangi bir tarayıcı da `http://localhost:3000/` adresine girin.
