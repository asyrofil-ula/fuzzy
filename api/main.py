from flask import Flask, request, jsonify
import numpy as np
import skfuzzy as fuzz
import matplotlib.pyplot as plt
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Inisialisasi variabel fuzzy
permintaan = np.arange(1000, 5001, 1)
persediaan = np.arange(100, 601, 1)
produksi = np.arange(0, 7001, 1)

permintaan_rendah = fuzz.trimf(permintaan, [1000, 1000, 3000])
permintaan_sedang = fuzz.trimf(permintaan, [2000, 3000, 4000])
permintaan_banyak = fuzz.trimf(permintaan, [3000, 5000, 5000])

persediaan_minim = fuzz.trimf(persediaan, [100, 100, 300])
persediaan_sedang = fuzz.trimf(persediaan, [200, 300, 400])
persediaan_banyak = fuzz.trimf(persediaan, [300, 600, 600])

produksi_kecil = fuzz.trimf(produksi, [0, 0, 2000])
produksi_sedang = fuzz.trimf(produksi, [1000, 3500, 5000])
produksi_besar = fuzz.trimf(produksi, [4000, 7000, 7000])
produksi_tidak = fuzz.trimf(produksi, [0, 0, 0])

print(permintaan_rendah)

def hitung_produksi(permintaan_input, persediaan_input):
    # Hitung derajat keanggotaan
    mu_perm_rendah = fuzz.interp_membership(permintaan, permintaan_rendah, permintaan_input)
    mu_perm_sedang = fuzz.interp_membership(permintaan, permintaan_sedang, permintaan_input)
    mu_perm_banyak = fuzz.interp_membership(permintaan, permintaan_banyak, permintaan_input)

    mu_pers_minim = fuzz.interp_membership(persediaan, persediaan_minim, persediaan_input)
    mu_pers_sedang = fuzz.interp_membership(persediaan, persediaan_sedang, persediaan_input)
    mu_pers_banyak = fuzz.interp_membership(persediaan, persediaan_banyak, persediaan_input)

    # Fungsi menghitung z berdasarkan alpha dan jenis produksi
    def calculate_z(alpha, jenis):
        if jenis == "kecil":
            return 2000 - alpha * (2000 - 0)
        elif jenis == "sedang":
            return 3500 - alpha * (3500 - 1000)
        elif jenis == "besar":
            return 7000 - alpha * (7000 - 4000)
        elif jenis == "tidak":
            return 0

    # Hitung α dan z untuk setiap aturan
    alpha1 = min(mu_perm_rendah, mu_pers_minim)
    z1 = calculate_z(alpha1, "kecil")

    alpha2 = min(mu_perm_rendah, mu_pers_sedang)
    z2 = calculate_z(alpha2, "tidak")

    alpha3 = min(mu_perm_rendah, mu_pers_banyak)
    z3 = calculate_z(alpha3, "tidak")

    alpha4 = min(mu_perm_sedang, mu_pers_minim)
    z4 = calculate_z(alpha4, "sedang")

    alpha5 = min(mu_perm_sedang, mu_pers_sedang)
    z5 = calculate_z(alpha5, "kecil")

    alpha6 = min(mu_perm_sedang, mu_pers_banyak)
    z6 = calculate_z(alpha6, "tidak")

    alpha7 = min(mu_perm_banyak, mu_pers_minim)
    z7 = calculate_z(alpha7, "besar")

    alpha8 = min(mu_perm_banyak, mu_pers_sedang)
    z8 = calculate_z(alpha8, "sedang")

    alpha9 = min(mu_perm_banyak, mu_pers_banyak)
    z9 = calculate_z(alpha9, "kecil")


    # Agregasi
    total_alpha = alpha1 + alpha2 + alpha3 + alpha4 + alpha5 + alpha6 + alpha7 + alpha8 + alpha9
    z_aggregated = (
        alpha1 * z1 + alpha2 * z2 + alpha3 * z3 +
        alpha4 * z4 + alpha5 * z5 + alpha6 * z6 +
        alpha7 * z7 + alpha8 * z8 + alpha9 * z9
    ) / total_alpha

    return z_aggregated, {
        'him_permintaan': {
            'rendah': mu_perm_rendah,
            'sedang': mu_perm_sedang,
            'banyak': mu_perm_banyak,
            # 'max_membership': max_mu_perm
        },
        'him_persediaan': {
            'minim': mu_pers_minim,
            'sedang': mu_pers_sedang,
            'banyak': mu_pers_banyak,
            # 'max_membership': max_mu_pers
        },
        'alpha_rules': {
            'R1': alpha1, 'z1': z1,
            'R2': alpha2, 'z2': z2,
            'R3': alpha3, 'z3': z3,
            'R4': alpha4, 'z4': z4,
            'R5': alpha5, 'z5': z5,
            'R6': alpha6, 'z6': z6,
            'R7': alpha7, 'z7': z7,
            'R8': alpha8, 'z8': z8,
            'R9': alpha9, 'z9': z9,
        }
    }


@app.route('/prediksi', methods=['POST'])
def prediksi():
    data = request.json
    permintaan_input = int(data.get('permintaan',0))
    persediaan_input = int(data.get('persediaan',0))
    
    if permintaan_input is None or persediaan_input is None:
        return jsonify({'error': 'Permintaan dan persediaan harus diberikan'}), 400

    produksi, derajat_keanggotaan = hitung_produksi(permintaan_input, persediaan_input)
    
    
    return jsonify({
        'permintaan' : permintaan_input,
        'persediaan' : persediaan_input,
        'produksi': round(produksi),
        'derajat_keanggotaan': derajat_keanggotaan,
        # 'data_chart': data_chart        
        })

@app.route('/fuzzification', methods=['GET'])
def fuzzification():
    data = {
        "permintaan": {
            "range": permintaan.tolist(),
            "rendah": permintaan_rendah.tolist(),
            "sedang": permintaan_sedang.tolist(),
            "banyak": permintaan_banyak.tolist(),
        },
        "persediaan": {
            "range": persediaan.tolist(),
            "minim": persediaan_minim.tolist(),
            "sedang": persediaan_sedang.tolist(),
            "banyak": persediaan_banyak.tolist(),
        },
        "produksi": {
            "range": produksi.tolist(),
            "kecil": produksi_kecil.tolist(),
            "sedang": produksi_sedang.tolist(),
            "besar": produksi_besar.tolist(),
        },
    }
    if request.method == 'GET':
        return jsonify(data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
