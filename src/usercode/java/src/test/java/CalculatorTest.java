import org.junit.Test;

import java.io.IOException;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static org.junit.matchers.JUnitMatchers.hasItem;

public class CalculatorTest {
    @Test
    public void testDataInfo() throws IOException {
        Calculator c = new Calculator();
        assertEquals(10, c.sum(3,1));
    }

    @Test
    public void testDataInfo2() throws IOException {
        Calculator c = new Calculator();
    }

}
