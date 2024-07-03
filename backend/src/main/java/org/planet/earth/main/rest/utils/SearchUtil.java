package org.planet.earth.main.rest.utils;

import java.util.StringTokenizer;

// final, because it's not supposed to be subclassed
public final class SearchUtil {

    // private constructor to avoid unnecessary instantiation of the class
    private SearchUtil() {}

    public static String getAttributeClause(String attributeName, String text) {
        StringBuilder clause = new StringBuilder();
        StringTokenizer st = new StringTokenizer(text, " ");
        while (st.hasMoreTokens()) {
            String token = st.nextToken();
            if (clause.isEmpty())
                clause.append(attributeName).append(" ilike '%").append(token).append("%'");
            else
                clause.append("OR ").append(attributeName).append(" ilike '%").append(token).append("%'");
        }
        return clause.toString();
    }
}
