import pandas as pd
import pytest

from backend.app.repository import analyze_cv


def test_analyze_text_cv_and_persist_report(tmp_path):
    result = analyze_cv(
        "candidata.txt",
        "Experiencia profesional con Python y visualización de datos.".encode(),
        "Python, Excel",
        storage_root=tmp_path,
    )

    assert result["coincidencias"] == 1
    assert result["porcentaje"] == 50
    assert result["estado"] == "low_accuracy"
    assert (tmp_path / "cv_input_temp" / "candidata.txt").exists()

    report = pd.read_csv(tmp_path / "filtered_cv" / "reporte_reclutamiento.csv")
    assert report.iloc[0]["archivo"] == "candidata.txt"


def test_analyze_cv_rejects_unsupported_files(tmp_path):
    with pytest.raises(ValueError, match="PDF o TXT"):
        analyze_cv(
            "candidata.docx",
            b"contenido",
            "Python",
            storage_root=tmp_path,
        )
