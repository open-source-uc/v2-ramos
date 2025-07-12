import { useEffect, useState, useRef } from "react";

type Course = {
    sigle: string;
    [key: string]: any;
};

const CACHE_KEY = "coursesSectionsCache";

export function useCoursesSections(): [Course[], boolean] {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log("hoal")

        const fetchData = async () => {
            console.log("Fetching courses sections...");


            const cache = sessionStorage.getItem(CACHE_KEY);
            if (cache) {
                setCourses(JSON.parse(cache));
                return;
            }

            try {
                setIsLoading(true);
                const response = await fetch("https://public.osuc.dev/courses-sections.ndjson");

                if (!response.ok) throw new Error("Network response was not ok");
                if (!response.body) throw new Error("ReadableStream not supported");

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                const parsedCourses: Course[] = [];

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        if (line.trim()) {
                            const item = JSON.parse(line);
                            parsedCourses.push(item);
                        }
                    }
                }

                // Último fragmento
                if (buffer.trim()) {
                    parsedCourses.push(JSON.parse(buffer));
                }

                setCourses(parsedCourses);
                sessionStorage.setItem(CACHE_KEY, JSON.stringify(parsedCourses));
            } catch (error) {
                console.error("Failed to fetch courses as stream:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);


    return [courses, isLoading];
}
