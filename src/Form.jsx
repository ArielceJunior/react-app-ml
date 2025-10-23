import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
function Form() {
  const [sl, setSl] = useState("");
  const [sw, setSw] = useState("");
  const [pl, setPl] = useState("");
  const [pw, setPw] = useState("");
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "sl":
        setSl(value);
        break;
      case "sw":
        setSw(value);
        break;
      case "pl":
        setPl(value);
        break;
      case "pw":
        setPw(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Colocar link do azure
      const response = await axios.post("https://apiml2025-fshabqf5esd0fzf8.canadacentral-01.azurewebsites.net/api/predict", {
        sl: parseFloat(sl),
        sw: parseFloat(sw),
        pl: parseFloat(pl),
        pw: parseFloat(pw),
      });
      setResult(response.data);
    } catch (error) {
      console.error(
        "Erro ao enviar a solicitação:",

        error
      );
    }
  };

  return (
    <div>
    <div className=" container">
      <h1 className="mb-4">Sistema de Predição</h1>
    </div>
    <div >
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-3">
            <label htmlFor="sl" className="form-label">Comprimento da Sépala (sl):</label>
            <input
              type="number"
              className="form-control"
              id="sl"
              name="sl"
              value={sl}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="sw" className="form-label">Largura da Sépala (sw):</label>
            <input
              type="number"
              className="form-control"
              id="sw"
              name="sw"
              value={sw}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="pl" className="form-label">Comprimento da Pétala (pl):</label>
            <input
              type="number"
              className="form-control"
              id="pl"
              name="pl"
              value={pl}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="pw" className="form-label">Largura da Pétala (pw):</label>
            <input
              type="number"
              className="form-control"
              id="pw"
              name="pw"
              value={pw}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Enviar</button>
        </form>
        {result && (
          <div className="card-body">
            <h2>Resultado da Predição:</h2>
            <p className="alert alert-primary">{result}</p>
          </div>
        )}
      </div>
</div>      
)}  


export default Form;
