import React from 'react';

const PurchaseCard = ({ purchaseList }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-transform hover:scale-105">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">
                            {purchaseList.vendor_name}
                        </h2>
                        <p className="text-sm text-gray-500 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {purchaseList.purchase_date}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                            ${purchaseList.bill_total}
                        </div>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-600 w-16">Client:</span>
                        <span className="text-gray-800">{purchaseList.client?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-start text-sm">
                        <span className="font-medium text-gray-600 w-16 mt-1">Notes:</span>
                        <span className="text-gray-800 flex-1">
                            {purchaseList.bill_description || 'No description provided'}
                        </span>
                    </div>
                </div>

                {purchaseList.bill ? (
                    <div className="relative group cursor-pointer">
                        <a href={`/storage/${purchaseList.bill}`} target="_blank" rel="noopener noreferrer">
                            <img
                                src={`/storage/${purchaseList.bill}`}
                                alt="Purchase Bill"
                                className="w-full h-48 object-cover rounded-lg border border-gray-200 transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </a>
                    </div>
                ) : (
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm">No bill image available</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchaseCard;