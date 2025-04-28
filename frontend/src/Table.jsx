import React from 'react'
import { fieldAliases } from './util/fieldAliases';

export default function Table({ data }) {
    return (
        <div className="max-h-[400px] border rounded-md">
            <table className="w-full bg-white rounded-md shadow ">
                <thead className="bg-gray-200 text-left sticky top-0 z-10">
                    <tr>
                        {Object.keys(fieldAliases).map((key) => (
                            <th key={key} className="px-2 py-2 border-b">{key.replace("_", ' ')}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (data.map((row, index) => (
                        <tr key={index} className="even:bg-gray-50">
                            {Object.keys(fieldAliases).map((key, i) => {
                                return (
                                    <td key={i} className="px-4 py-2 border-b">{row[key] ?? "-"}</td>
                                );
                            })}
                        </tr>
                    ))):  (
                        <tr>
                          <td colSpan={Object.keys(fieldAliases).length} className="text-center justify-center py-2 text-gray-500">
                            No data found
                          </td>
                        </tr>
                      )}
                    
                </tbody>
            </table>
        </div>
    )
}
