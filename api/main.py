from flask import Flask, request, jsonify
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Definisikan domain jumlah inventori
jumlah_inventori = np.arange(0, 80, 1)

# Fungsi keanggotaan inventori
def inventori_minim(x):
    if x <= 30:
        return 1
    elif 30 < x <= 40:
        return (40 - x) / 10
    else:
        return 0

def inventori_sedang(x):
    if 35 <= x <= 40:
        return (x - 35) / 5
    elif 40 < x <= 45:
        return (45 - x) / 5
    else:
        return 0

def inventori_banyak(x):
    if 40 <= x <= 45:
        return (x - 40) / 5
    elif x > 45:
        return 1
    else:
        return 0

# Definisikan domain jumlah permintaan
jumlah_permintaan = np.arange(0, 80, 1)

# Fungsi keanggotaan permintaan
def permintaan_minim_func(x):
    if x <= 10:
        return 1
    elif 10 < x <= 30:
        return (30 - x) / 20
    else:
        return 0

def permintaan_sedang_func(x):
    if 10 <= x <= 20:
        return (x - 10) / 10
    elif 20 < x <= 40:
        return (40 - x) / 20
    else:
        return 0

def permintaan_banyak_func(x):
    if 20 <= x <= 40:
        return (x - 20) / 20
    elif x > 40:
        return 1
    else:
        return 0


@app.route('/fuzzification', methods=['GET'])
def fuzzification():
    persediaan_minim = [inventori_minim(x) for x in jumlah_inventori]
    persediaan_sedang = [inventori_sedang(x) for x in jumlah_inventori]
    persediaan_banyak = [inventori_banyak(x) for x in jumlah_inventori]
    
    permintaan_minim = [permintaan_minim_func(x) for x in jumlah_permintaan]
    permintaan_sedang = [permintaan_sedang_func(x) for x in jumlah_permintaan]
    permintaan_banyak = [permintaan_banyak_func(x) for x in jumlah_permintaan]

    data = {
        "permintaan":{
            "range": jumlah_permintaan.tolist(),
            "rendah": permintaan_minim,
            "sedang": permintaan_sedang,
            "banyak": permintaan_banyak
        },
        "persediaan":{
            "range": jumlah_inventori.tolist(),
            "minim": persediaan_minim,
            "sedang": persediaan_sedang,
            "banyak": persediaan_banyak
        },
    
    }
    return jsonify(data)


@app.route('/prediksi', methods=['POST'])
def prediksi():
    data = request.get_json()
    j_inventory = int(data.get('persediaan', 0))
    j_permintaan = int(data.get('permintaan', 0))

    # Fuzzifikasi untuk inventory
    if j_inventory >= 0 and j_inventory <= 30:
        finventory_minim = 1
        finventory_sedang = 0
        finventory_banyak = 0
    elif j_inventory >= 31 and j_inventory <= 35:
        finventory_minim = (40 - j_inventory) / (40 - 30)
        finventory_sedang = 0
        finventory_banyak = 0
    elif j_inventory >= 35 and j_inventory <= 40:
        finventory_minim = (40 - j_inventory) / (40 - 30)
        finventory_sedang = (j_inventory - 35) / (40 - 35)
        finventory_banyak = 0
    elif j_inventory >= 40 and j_inventory <= 45:
        finventory_minim = 0
        finventory_sedang = (45 - j_inventory) / (45 - 40)
        finventory_banyak = (j_inventory - 40) / (45 - 40)
    else:
        finventory_minim = 0
        finventory_sedang = 0
        finventory_banyak = 1

    # Fuzzifikasi untuk permintaan
    if j_permintaan >= 0 and j_permintaan <= 10:
        fpermintaan_rendah = 1
        fpermintaan_sedang = 0
        fpermintaan_tinggi = 0
    elif j_permintaan >= 10 and j_permintaan <= 20:
        fpermintaan_rendah = (30 - j_permintaan) / (30 - 10)
        fpermintaan_sedang = (j_permintaan - 10) / (20 - 10)
        fpermintaan_tinggi = 0
    elif j_permintaan >= 20 and j_permintaan <= 30:
        fpermintaan_rendah = (30 - j_permintaan) / (30 - 10)
        fpermintaan_sedang = (40 - j_permintaan) / (40 - 20)
        fpermintaan_tinggi = (j_permintaan - 20) / (40 - 20)
    elif j_permintaan >= 30 and j_permintaan <= 40:
        fpermintaan_rendah = 0
        fpermintaan_sedang = (40 - j_permintaan) / (40 - 20)
        fpermintaan_tinggi = (j_permintaan - 20) / (40 - 20)
    else:
        fpermintaan_rendah = 0
        fpermintaan_sedang = 0
        fpermintaan_tinggi = 1

    # Inferensi
    fproduksi_kecil_r1 = min(fpermintaan_rendah, finventory_minim)
    fproduksi_tidak_r2 = min(fpermintaan_rendah, finventory_sedang)
    fproduksi_tidak_r3 = min(fpermintaan_rendah, finventory_banyak)
    fproduksi_sedang_r4 = min(fpermintaan_sedang, finventory_minim)
    fproduksi_kecil_r5 = min(fpermintaan_sedang, finventory_sedang)
    fproduksi_tidak_r6 = min(fpermintaan_sedang, finventory_banyak)
    fproduksi_besar_r7 = min(fpermintaan_tinggi, finventory_minim)
    fproduksi_sedang_r8 = min(fpermintaan_tinggi, finventory_sedang)
    fproduksi_kecil_r9 = min(fpermintaan_tinggi, finventory_banyak)

    fproduksi_tidak = max(fproduksi_tidak_r2, fproduksi_tidak_r3, fproduksi_tidak_r6)
    fproduksi_kecil = max(fproduksi_kecil_r1, fproduksi_kecil_r5, fproduksi_kecil_r9)
    fproduksi_sedang = max(fproduksi_sedang_r4, fproduksi_sedang_r8)
    fproduksi_besar = fproduksi_besar_r7

    # Defuzzifikasi
    if fproduksi_tidak > 0 and fproduksi_kecil > 0 and fproduksi_sedang > 0 and fproduksi_besar > 0:
        numerator = (
            (0 * fproduksi_tidak) +
            (10 * fproduksi_kecil) +
            (25 * fproduksi_sedang) +
            (40 * fproduksi_besar)
        )
        denominator = (fproduksi_tidak + fproduksi_kecil + fproduksi_sedang + fproduksi_besar)
        x = numerator / denominator if denominator != 0 else 0
    elif fproduksi_tidak > 0 and fproduksi_kecil > 0 and fproduksi_sedang > 0:
        numerator = ((0 * fproduksi_tidak) + (10 * fproduksi_kecil) + (25 * fproduksi_sedang))
        denominator = (fproduksi_tidak + fproduksi_kecil + fproduksi_sedang)
        x = numerator / denominator if denominator != 0 else 0
    elif fproduksi_kecil > 0 and fproduksi_sedang > 0 and fproduksi_besar > 0:
        numerator = ((10 * fproduksi_kecil) + (25 * fproduksi_sedang) + (40 * fproduksi_besar))
        denominator = (fproduksi_kecil + fproduksi_sedang + fproduksi_besar)
        x = numerator / denominator if denominator != 0 else 0
    elif fproduksi_tidak > 0 and fproduksi_kecil > 0 and fproduksi_besar > 0:
        numerator = (0 * fproduksi_tidak) + (10 * fproduksi_kecil) + (40 * fproduksi_besar)
        denominator = fproduksi_tidak + fproduksi_kecil + fproduksi_besar
        x = numerator / denominator if denominator != 0 else 0
    elif fproduksi_tidak > 0 and fproduksi_sedang > 0 and fproduksi_besar > 0:
        numerator = (0 * fproduksi_tidak) + (25 * fproduksi_sedang) + (40 * fproduksi_besar)
        denominator = fproduksi_tidak + fproduksi_sedang + fproduksi_besar
        x = numerator / denominator if denominator != 0 else 0
    elif fproduksi_tidak > 0 and fproduksi_sedang > 0:
        numerator = (0 * fproduksi_tidak) + (25 * fproduksi_sedang)
        denominator = fproduksi_tidak + fproduksi_sedang
        x = numerator / denominator if denominator != 0 else 0
    elif fproduksi_kecil > 0 and fproduksi_besar > 0:
        numerator = (10 * fproduksi_kecil) + (40 * fproduksi_besar)
        denominator = fproduksi_kecil + fproduksi_besar
        x = numerator / denominator if denominator != 0 else 0
    elif fproduksi_tidak > 0 and fproduksi_kecil > 0:
        x = 10 / ((fproduksi_tidak / fproduksi_kecil) + 1)
    elif fproduksi_kecil > 0 and fproduksi_sedang > 0:
        x = 10 + 10 / ((fproduksi_kecil / fproduksi_sedang) + 1)
    elif fproduksi_sedang > 0 and fproduksi_besar > 0:
        x = 25 + 15 / ((fproduksi_sedang / fproduksi_besar) + 1)
    elif fproduksi_tidak > 0 and fproduksi_sedang > 0:
        x = 10 / ((fproduksi_tidak / fproduksi_sedang) + 1)
    else:
        if fproduksi_tidak > 0:
            x = 0
        elif fproduksi_kecil > 0:
            x = 10
        elif fproduksi_sedang > 0:
            x = 25
        elif fproduksi_besar > 0:
            x = 40
        else:
            x = 0

    return jsonify({
        "him_permintaan": {
            "rendah": fpermintaan_rendah,
            "sedang": fpermintaan_sedang,
            "banyak": fpermintaan_tinggi,
        },
        "him_persediaan": {
            "minim": finventory_minim,
            "sedang": finventory_sedang,
            "banyak": finventory_banyak,
        },
        "him_produksi": {
            "fproduksi_tidak": fproduksi_tidak,
            "fproduksi_kecil": fproduksi_kecil,
            "fproduksi_sedang": fproduksi_sedang,
            "fproduksi_tinggi": fproduksi_besar,
        },
        "persediaan": j_inventory,
        "permintaan": j_permintaan,
        "produksi": x
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
