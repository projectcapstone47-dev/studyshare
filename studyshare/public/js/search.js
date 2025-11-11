// Search functionality (can be used across pages)

class MaterialSearch {
    constructor(materials) {
        this.materials = materials;
    }

    // Search by multiple criteria
    search(query, filters = {}) {
        let results = this.materials;

        // Text search
        if (query && query.trim() !== '') {
            const searchTerms = query.toLowerCase().trim().split(' ');
            
            results = results.filter(material => {
                const searchableText = [
                    material.title,
                    material.subject,
                    material.uploaded_by
                ].join(' ').toLowerCase();

                return searchTerms.every(term => 
                    searchableText.includes(term)
                );
            });
        }

        // Filter by subject
        if (filters.subject) {
            results = results.filter(m => 
                m.subject.toLowerCase() === filters.subject.toLowerCase()
            );
        }

        // Filter by semester
        if (filters.semester) {
            results = results.filter(m => 
                m.semester.toString() === filters.semester.toString()
            );
        }

        // Filter by file type
        if (filters.fileType) {
            results = results.filter(m => 
                m.file_type.includes(filters.fileType)
            );
        }

        return results;
    }

    // Sort results
    sort(results, sortBy = 'date', order = 'desc') {
        const sorted = [...results];

        switch (sortBy) {
            case 'date':
                sorted.sort((a, b) => 
                    new Date(b.upload_timestamp) - new Date(a.upload_timestamp)
                );
                break;
            case 'downloads':
                sorted.sort((a, b) => 
                    b.downloads_count - a.downloads_count
                );
                break;
            case 'title':
                sorted.sort((a, b) => 
                    a.title.localeCompare(b.title)
                );
                break;
        }

        return order === 'asc' ? sorted.reverse() : sorted;
    }

    // Get suggestions for autocomplete
    getSuggestions(query, field = 'subject') {
        if (!query || query.length < 2) return [];

        const uniqueValues = [...new Set(this.materials.map(m => m[field]))];
        
        return uniqueValues.filter(value => 
            value.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MaterialSearch;
}
