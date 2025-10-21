#!/usr/bin/env python3
"""Descarga y procesa el dataset DDTrain, luego lo divide en archivos CSV por chunks.

Uso:
  python scripts/download_and_chunk.py

Notas:
 - La URL proporcionada en el prompt está truncada (X-Goog-Signature=...).
   Si la URL expira o está incompleta, reemplace `DATA_URL` por la URL válida.
"""
import os
import sys
import pandas as pd
import numpy as np
import requests as rq


DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "content")
# Cambiar a True para guardar un único archivo CSV procesado en lugar de dividir en chunks
SAVE_SINGLE_CSV = True
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "output")


def ensure_dir(path):
    os.makedirs(path, exist_ok=True)


def download_file(url: str, out_path: str) -> bool:
    """Descarga la URL mediante GET y escribe el contenido en out_path.

    Retorna True si status_code == 200, False en otro caso.
    """
    print(f"Descargando desde: {url}")
    resp = rq.get(url)
    if resp.status_code == 200:
        # Guardar texto
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(resp.text)
        print("Archivo descargado y guardado correctamente ✅")
        return True
    else:
        print(f"Error al descargar: {resp.status_code}")
        return False


def process_dataset(txt_path: str) -> pd.DataFrame:
    cols = [
        "duration","protocol_type","service","flag","src_bytes","dst_bytes","land","wrong_fragment",
        "urgent","hot","num_failed_logins","logged_in","num_compromised","root_shell","su_attempted",
        "num_root","num_file_creations","num_shells","num_access_files","num_outbound_cmds",
        "is_host_login","is_guest_login","count","srv_count","serror_rate","srv_serror_rate",
        "rerror_rate","srv_rerror_rate","same_srv_rate","diff_srv_rate","srv_diff_host_rate",
        "dst_host_count","dst_host_srv_count","dst_host_same_srv_rate","dst_host_diff_srv_rate",
        "dst_host_same_src_port_rate","dst_host_srv_diff_host_rate","dst_host_serror_rate",
        "dst_host_srv_serror_rate","dst_host_rerror_rate","dst_host_srv_rerror_rate","class","difficulty"
    ]

    print(f"Leyendo CSV desde: {txt_path}")
    df = pd.read_csv(txt_path, header=None, names=cols, low_memory=False)

    # Crear columna binario
    df["binario"] = [0 if valor == "normal" else 1 for valor in df["class"]]

    tabla = df.drop("class", axis=1)

    # Dummies para columnas categóricas
    tabla2 = pd.get_dummies(tabla, columns=["protocol_type", "service", "flag"]).astype(int)

    return tabla2


def chunk_and_save(df: pd.DataFrame, out_dir: str, chunk_size: int = 1500, prefix: str = "VPN_TRAIN_"):
    ensure_dir(out_dir)
    total_rows = len(df)
    num_files = (total_rows // chunk_size) + (1 if total_rows % chunk_size != 0 else 0)

    for i in range(num_files):
        start_row = i * chunk_size
        end_row = start_row + chunk_size
        chunk = df.iloc[start_row:end_row]
        out_path = os.path.join(out_dir, f"{prefix}{i+1}.csv")
        chunk.to_csv(out_path, index=False)

    print(f"Se generaron {num_files} archivos CSV de aproximadamente {chunk_size} registros cada uno.")


def main():
    # URL provista en el prompt (nota: firma truncada)
    DATA_URL = (
        "https://storage.googleapis.com/kagglesdsdata/datasets/8055676/12749858/DDTrain.txt"
        # Si tiene la URL completa con parámetros X-Goog-* reemplácela aquí
    )

    # Primero, comprobar si existe un archivo local (ruta proporcionada por el usuario)
    local_candidates = [
        r"C:\Users\PC-LUISGMEZ\Desktop\IA DATASET\Datasets\KDDTrain.text",
        r"C:\Users\PC-LUISGMEZ\Desktop\IA DATASET\Datasets\KDDTrain.txt",
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "content", "KDDTrain.txt")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "content", "DDTrain.txt")),
    ]

    local_file = None
    for p in local_candidates:
        if os.path.exists(p):
            local_file = p
            print(f"Usando archivo local encontrado: {local_file}")
            break

    if local_file is None:
        # Si no hay archivo local, intentar descargar desde DATA_URL y guardarlo en content
        base_content_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "content"))
        ensure_dir(base_content_dir)
        out_file = os.path.join(base_content_dir, "DDTrain.txt")

        ok = download_file(DATA_URL, out_file)
        if not ok:
            print("No se pudo descargar el archivo. Verifique la URL o coloque el archivo local en:")
            print("  C:\\Users\\PC-LUISGMEZ\\Desktop\\IA DATASET\\Datasets\\KDDTrain.text")
            sys.exit(1)

        local_file = out_file

    # Procesar el archivo encontrado
    tabla2 = process_dataset(local_file)

    if SAVE_SINGLE_CSV:
        # Guardar como un único archivo CSV procesado
        out_dir = os.path.abspath(OUT_DIR)
        ensure_dir(out_dir)
        out_path = os.path.join(out_dir, "KDD_TRAIN_FULL.csv")
        tabla2.to_csv(out_path, index=False)
        print(f"Archivo CSV procesado guardado en: {out_path}")
    else:
        # Guardar chunks en la carpeta chunks/ (raíz del proyecto)
        chunks_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "chunks"))
        chunk_and_save(tabla2, chunks_dir, chunk_size=1500, prefix="KDD_TRAIN_")


if __name__ == "__main__":
    main()
