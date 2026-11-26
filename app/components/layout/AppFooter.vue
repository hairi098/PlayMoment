<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <NuxtLink to="/" class="footer-logo">
            <img src="/playmoment/logo-white.png" alt="PlayMoment Logo" class="logo-img" />
            <span class="logo-text">
              <span class="logo-dark">Play</span><span class="logo-accent">Moment</span>
            </span>
          </NuxtLink>
          <p class="footer-tagline">
            Platform undangan digital terbaik untuk momen spesial kamu. Buat,
            kirim, dan kelola undangan dengan mudah.
          </p>
          <div class="footer-socials">
            <a href="#" class="social-btn" aria-label="Instagram">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            <a href="#" class="social-btn" aria-label="TikTok">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.32a8.16 8.16 0 004.78 1.52V7.4a4.85 4.85 0 01-1.01-.71z"
                />
              </svg>
            </a>
            <a
              href="https://wa.me/628123456789"
              class="social-btn"
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                />
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-links-group">
          <div class="footer-col">
            <h4 class="footer-col-title">Produk</h4>
            <ul>
              <li><NuxtLink to="/tema">Tema Undangan</NuxtLink></li>
              <li><NuxtLink to="/fitur">Fitur Lengkap</NuxtLink></li>
              <li><NuxtLink to="/paket">Harga & Paket</NuxtLink></li>
              <li><a href="#">Custom Tema</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4 class="footer-col-title">Kategori</h4>
            <ul>
              <li><a href="#">Wedding</a></li>
              <li><a href="#">Ulang Tahun</a></li>
              <li><a href="#">Khitanan & Aqiqah</a></li>
              <li><a href="#">Gathering & Seminar</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4 class="footer-col-title">Bantuan</h4>
            <ul>
              <li>
                <a
                  href="https://wa.me/628123456789"
                  target="_blank"
                  rel="noopener"
                  >Hubungi Kami</a
                >
              </li>
              <li><a href="#">Syarat & Ketentuan</a></li>
              <li><a href="#">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copy">
          © {{ currentYear }} PlayMoment. Hak cipta dilindungi.
        </p>
        <div class="footer-bottom-links">
          <a href="#">Privasi</a>
          <a href="#">Ketentuan</a>
          <a href="#">Cookie</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.site-footer {
  background: #111c2d;
  padding: 52px 0 0;
  font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
}

.footer-top {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-brand {
  max-width: 320px;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  text-decoration: none;
  margin-bottom: 14px;
}
.logo-img {
  height: 28px;
  width: auto;
}
.logo-dark {
  color: #fff;
}
.logo-accent {
  color: #7ecec4;
}

.footer-tagline {
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.7;
  margin-bottom: 22px;
  font-size: 14px;
}

.footer-socials {
  display: flex;
  gap: 10px;
}

.social-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition:
    background 0.2s,
    color 0.2s,
    transform 0.2s;
}
.social-btn:hover {
  background: #7ecec4;
  color: #1a2e45;
  transform: translateY(-2px);
}

.footer-links-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px 20px;
}

.footer-col-title {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 16px;
}

.footer-col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 11px;
}
.footer-col ul a,
.footer-col ul :deep(a) {
  color: rgba(255, 255, 255, 0.52);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}
.footer-col ul a:hover,
.footer-col ul :deep(a:hover) {
  color: #7ecec4;
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  padding: 20px 0 100px;
}
.footer-copy {
  color: rgba(255, 255, 255, 0.3);
  font-size: 13px;
}
.footer-bottom-links {
  display: flex;
  gap: 20px;
}
.footer-bottom-links a {
  color: rgba(255, 255, 255, 0.3);
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}
.footer-bottom-links a:hover {
  color: #7ecec4;
}

@media (min-width: 640px) {
  .footer-links-group {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .footer-top {
    flex-direction: row;
    gap: 80px;
    align-items: flex-start;
  }
  .footer-brand {
    flex-shrink: 0;
    width: 280px;
  }
  .footer-links-group {
    flex: 1;
    grid-template-columns: repeat(3, 1fr);
  }
  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
    padding-bottom: 32px;
  }
}
</style>
