# PREDIKSI PRODUKSI BARANG MENGGUNAKAN FUZZY LOGIC

## **1. Permintaan (1000 - 5000)**
- **Rendah**: [1000, 1000, 3000] (min = 1000, max = 3000)
- **Sedang**: [2000, 3000, 4000] (a = 2000, b = 3000, c = 4000)
- **Banyak**: [3000, 5000, 5000] (min = 3000, max = 5000)

## **2. Persediaan (100 - 600)**
- **Minim**: [100, 100, 300] (min = 100, max = 300)
- **Sedang**: [200, 300, 400] (a = 200, b = 300, c = 400)
- **Banyak**: [300, 600, 600] (min = 300, max = 500)

## **3. Produksi (0 – 7000)**
- **Tidak produksi**: 0
- **Minim**: [0, 0, 2000] (min = 0, max = 2000)
- **Sedang**: [1000, 3500, 5000] (a = 1000, b = 3500, c = 5000)
- **Banyak**: [4000, 7000, 7000] (min = 4000, max = 7000)

## **4. Contoh Kasus**
### Input:
- Permintaan: 3213
- Persediaan: 231
- Produksi: ???

### **Fuzzification**
#### **Fungsi keanggotaan permintaan**:
1. **Rendah** [1000, 1000, 3000]:
   - Karena x > max(3000), maka μ(3213) = 0

2. **Sedang** [2000, 3000, 4000]:
   - Karena b(3000) < x(3213) < c(4000), maka:
     μ(3213) = (4000-3213)/(4000-3000) = 787/1000 = 0,787

3. **Banyak** [3000, 5000, 5000]:
   - Karena min(3000) < x(3213) < max(5000), maka:
     μ(3213) = (3213-3000)/(5000-3000) = 213/2000 = 0,1065

**Hasil:**
- μ(rendah) = 0
- μ(sedang) = 0,787
- μ(banyak) = 0,1065

#### **Fungsi keanggotaan persediaan**:
1. **Minim** [100, 100, 300]:
   - Karena min(100) < x(231) < max(300), maka:
     μ(231) = (300-231)/(300-100) = 69/200 = 0,345

2. **Sedang** [200, 300, 400]:
   - Karena a(200) < x(231) < b(300), maka:
     μ(231) = (231-200)/(300 - 200) = 31/100 = 0,31

3. **Banyak** [300, 600, 600]:
   - Karena x(231) < min(300), maka μ(231) = 0

**Hasil:**
- μ(minim) = 0,345
- μ(sedang) = 0,31
- μ(banyak) = 0

### **5. Inferensi**
#### Aturan Fuzzy:
1. R1: Permintaan RENDAH dan Stok MINIM → Produksi KECIL
2. R2: Permintaan RENDAH dan Stok SEDANG → TIDAK produksi
3. R3: Permintaan RENDAH dan Stok BANYAK → TIDAK produksi
4. R4: Permintaan SEDANG dan Stok MINIM → Produksi SEDANG
5. R5: Permintaan SEDANG dan Stok SEDANG → Produksi KECIL
6. R6: Permintaan SEDANG dan Stok BANYAK → TIDAK produksi
7. R7: Permintaan TINGGI dan Stok MINIM → Produksi BESAR
8. R8: Permintaan TINGGI dan Stok SEDANG → Produksi SEDANG
9. R9: Permintaan TINGGI dan Stok BANYAK → Produksi KECIL

#### Hasil Fuzzifikasi:
|                  | Rendah | Sedang | Tinggi |
|------------------|--------|--------|--------|
| **Permintaan**   | 0      | 0,787  | 0,1065 |
| **Persediaan**   | 0,345  | 0,31   | 0      |

### **6. Defuzzifikasi**
Proses defuzzifikasi akan menggunakan metode rata-rata berbobot (Weighted Average) untuk mendapatkan hasil akhir produksi.

