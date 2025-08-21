import pandas as pd
import random
import time
from datetime import datetime


def generate_dummy_entry(base_time, classes): # Dummy Random
    if classes == "Aman": # Keadaan Aman
        rain_status = random.randint(1,2)
        water_level = random.uniform(0, 19)
        rain_duration = random.randint(0,59)
    if classes == "Waspada": # Keadaan Waspada (Genangan)
        rain_status = random.randint(1,3)
        water_level = random.uniform(20, 49)
        rain_duration = random.randint(60, 60*4) # Cetak keadaan hujan range 1 jam-4 jam
    if classes == "Bahaya": # Keadaan Bahaya (Evakuasi)
        rain_status = random.randint(1,3)
        water_level = random.uniform(50, 100)
        rain_duration = random.randint(0,60*4) # Cetak keadaan hujan range 0 jam(hujan berhenti tapi genangan tinggi) - 4 jam

    return {
        "timestamp": int(base_time),
        "rain_status": rain_status, # 0 = tidak hujan; 1 = gerimis, 2 = sedang, 3 = deras
        "rain_duration_minutes": rain_duration, # In Minutes
        "water_level": water_level, # In CM
        "label": classes,
    }

def dummy_specific_entry(base_time, classes): # Dummy Specific ke Level Air
    if classes == "Aman":
        water_level = random.uniform(0,19)
        rain_status = 0
        rain_duration = 0
    if classes == "Waspada":
        water_level = random.uniform(20,49)
        rain_duration = 0
        rain_status = 0
    if classes == "Bahaya":
        water_level = random.uniform(50,100)
        rain_duration = 0
        rain_status = 0

    return {
        "timestamp": int(base_time),
        "rain_status": rain_status, # 0 = tidak hujan; 1 = gerimis, 2 = sedang, 3 = deras
        "rain_duration_minutes": rain_duration, # In Minutes
        "water_level": water_level, # In CM
        "label": classes,
    }

def dummy_danger_entry(base_time, classes): # Dummy Berfokus pada status hujan
    if classes == "Waspada":
        water_level = 0
        rain_status = random.randint(2,3) # Hujan Lebat dan Sedang
        rain_duration = random.randint(60*3, 60*5) # Hujan selama 3-5 jam

        return {
        "timestamp": int(base_time),
        "rain_status": rain_status, # 0 = tidak hujan; 1 = gerimis, 2 = sedang, 3 = deras
        "rain_duration_minutes": rain_duration, # In Minutes
        "water_level": water_level, # In CM
        "label": classes,
        }
    if classes == "Aman":
        water_level = 0
        rain_status = random.randint(1,2)
        rain_duration = random.randint(0, 60*2) # Hujan Sedang dan Gerimis selama 0-2 jam masih bisa dibilang aman

        return {
        "timestamp": int(base_time),
        "rain_status": rain_status, # 0 = tidak hujan; 1 = gerimis, 2 = sedang, 3 = deras
        "rain_duration_minutes": rain_duration, # In Minutes
        "water_level": water_level, # In CM
        "label": classes,
        }


label_classes = ["Aman","Waspada","Bahaya"]
i = 101
# Generate dummy dataset dengan generate_dummy_entry
for cls in label_classes:
    for file_num in range(i, i+100):
        base_time = int(time.time())
        data = [generate_dummy_entry(base_time + entry_num + 1, cls) for entry_num in range(200)]
        filename = f"dummy_flood_dataset_{file_num}_{cls}.csv"
        df = pd.DataFrame(data)
        df.to_csv(filename, index=False)
    i += 100

# Generate dummy dataset dengan dummy_specific_entry
i = 501
for cls in label_classes:
    for file_num in range(i, i+100):
        base_time = int(time.time())
        data = [dummy_specific_entry(base_time + entry_num + 1, cls) for entry_num in range(200)]
        filename = f"dummy_flood_specific_{file_num}_{cls}.csv"
        df = pd.DataFrame(data)
        df.to_csv(filename, index=False)
    i += 100

# Generate dummy dataset dengan dummy_danger_entry
i = 801
for cls in label_classes:
    for file_num in range(i, i+100):
        base_time = int(time.time())
        data = [dummy_danger_entry(base_time + entry_num + 1, cls) for entry_num in range(200)]
        filename = f"dummy_flood_danger_{file_num}_{cls}.csv"
        df = pd.DataFrame(data)
        df.to_csv(filename, index=False)
    i += 100
