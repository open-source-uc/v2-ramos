import React, { useState, useEffect } from "react";

const DemoComponent = () => {
    const [count, setCount] = useState(0);
    const [name, setName] = useState("");
    const [data, setData] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(true);

    // Simula fetch de datos con useEffect
    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => {
            setData(["Curso 1", "Curso 2", "Curso 3"]);
            setLoading(false);
        }, 2000);

        // Limpieza
        return () => {
            clearTimeout(timeout);
            console.log("Cleanup ejecutado");
        };
    }, []);

    return (
        <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
            <h1>React Demo</h1>

            <button onClick={() => setCount(c => c + 1)}>
                Aumentar contador: {count}
            </button>

            <div style={{ marginTop: "1rem" }}>
                <label>
                    Nombre:
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        style={{ marginLeft: "0.5rem" }}
                    />
                </label>
                <p>Hola, {name || "desconocido"}!</p>
            </div>

            <div style={{ marginTop: "1rem" }}>
                <button onClick={() => setVisible(v => !v)}>
                    {visible ? "Ocultar datos" : "Mostrar datos"}
                </button>

                {visible && (
                    <div>
                        <h2>Datos:</h2>
                        {loading ? (
                            <p>Cargando...</p>
                        ) : (
                            <ul>
                                {data?.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DemoComponent;
