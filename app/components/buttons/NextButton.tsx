import React from 'react';
import Link from 'next/link';

const NextButton = ({ nextPage }: { nextPage: number }) => {

    return (
        <Link href={`?page=${nextPage}`}>
            <span className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition">
                Siguiente
            </span>
        </Link>

    );
};

export default NextButton;
